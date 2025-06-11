// jest.setup.ts - Global setup file for Jest tests
import '@testing-library/jest-dom';

// Setup global Jest mocks
jest.mock('@/lib/supabase', () => {  
  return {
  createServerSupabaseClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              then: jest.fn().mockResolvedValue({ data: [] })
            })
          })
        }),
        single: jest.fn().mockResolvedValue({ data: null }),
        match: jest.fn().mockReturnValue({
          then: jest.fn().mockResolvedValue({ data: [] })
        })
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {} })
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          then: jest.fn().mockResolvedValue({ data: {} })
        })
      })
    })
  }),
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              then: jest.fn().mockResolvedValue({ data: [] })
            })
          })
        })
      }),
      insert: jest.fn().mockReturnValue({
        then: jest.fn().mockResolvedValue({ data: {} })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          then: jest.fn().mockResolvedValue({ data: {} })
        })
      })
    }),
    auth: {
      signOut: jest.fn().mockResolvedValue({}),
      getUser: jest.fn().mockResolvedValue({ data: { user: null } })
    }
  })
  };
});
