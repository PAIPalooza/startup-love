'use client'

import Link from 'next/link'
import { useState } from 'react'

interface SPV {
  id: string
  name: string
  status: string
  target_raise: number
  committed_amount: number
  minimum_investment: number
  created_at: string
  spv_members?: Array<{
    id: string
    amount_committed: number
    status: string
    users: {
      full_name: string
      email: string
    }
  }>
}

interface SPVCardProps {
  spv: SPV
}

export function SPVCard({ spv }: SPVCardProps) {
  const [showMembers, setShowMembers] = useState(false)

  const commitmentProgress = spv.target_raise 
    ? (spv.committed_amount / spv.target_raise) * 100 
    : 0

  const totalMembers = spv.spv_members?.length || 0
  const committedMembers = spv.spv_members?.filter(m => m.status === 'committed').length || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'committed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'withdrawn':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{spv.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(spv.status)}`}>
                {spv.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Created {new Date(spv.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ${spv.committed_amount.toLocaleString()} / ${spv.target_raise.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Committed / Target</p>
          </div>
        </div>
      </div>

      {/* Progress and Stats */}
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Fundraising Progress</span>
            <span>{commitmentProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(commitmentProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalMembers}</div>
            <div className="text-xs text-gray-500">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{committedMembers}</div>
            <div className="text-xs text-gray-500">Committed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${spv.minimum_investment.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Min Investment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalMembers > 0 ? Math.round(spv.committed_amount / totalMembers).toLocaleString() : '0'}
            </div>
            <div className="text-xs text-gray-500">Avg Commitment</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href={`/dashboard/founder/spvs/${spv.id}`}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
          >
            Manage SPV
          </Link>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
          >
            {showMembers ? 'Hide Members' : `View Members (${totalMembers})`}
          </button>
          <Link
            href={`/dashboard/founder/spvs/${spv.id}/invite`}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
          >
            Invite Investors
          </Link>
        </div>

        {/* Members List */}
        {showMembers && spv.spv_members && spv.spv_members.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">SPV Members</h4>
            <div className="space-y-2">
              {spv.spv_members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.users.full_name}
                    </p>
                    <p className="text-xs text-gray-500">{member.users.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${member.amount_committed.toLocaleString()}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getMemberStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showMembers && (!spv.spv_members || spv.spv_members.length === 0) && (
          <div className="border-t pt-4 text-center text-gray-500">
            <p className="text-sm">No members have joined this SPV yet</p>
          </div>
        )}
      </div>
    </div>
  )
}