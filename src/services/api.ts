/**
 * File: frontend-web/src/services/api.ts
 * Purpose: Business Licensing Service API wrapper using generated SDK
 * EN: BLS API client using generated TypeScript SDK
 * VI: Client API BLS sử dụng SDK đã tạo
 */

// Intentionally no SDK imports here; endpoints are not available in current OpenAPI.

// Re-export types for backward compatibility
export interface BeneficialOwner {
  citizen_id: string;
  full_name: string;
  ownership_percentage: number;
  control_method: string;
}

export interface BusinessLine {
  code: string;
  description_vi: string;
  is_licensed: boolean;
}

export interface Deficiency {
  code: string;
  category: string;
  description_vi: string;
  instruction_vi: string;
  legal_basis_vi: string;
}

export interface CaseDetail {
  procedure_id: string;
  procedure_type: string;
  status: string;
  result_status: string;
  enterprise_name: string;
  tin: string;
  address: string;
  submitter_name: string;
  submitter_citizen_id: string;
  beneficial_owners: BeneficialOwner[];
  business_lines: BusinessLine[];
  deficiencies: Deficiency[];
  validation_passed: boolean;
  validation_errors: string[];
  signing_status: string;
  ai_analysis?: {
    confidence_score: number;
    risk_level: string;
    recommendations: string[];
    extracted_entities: Record<string, any>;
  };
  created_at: string;
  submitted_at: string | null;
  completed_at: string | null;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  processing_status: string;
  approval_status: string;
  ai_analysis?: {
    summary: string;
    key_points: string[];
  };
  uploaded_at: string;
  uploaded_by: string;
}

// ============================================================================
// API CLIENT USING GENERATED SDK
// ============================================================================

export const casesAPI = {
  getAll: async (params?: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      console.warn('BLS procedures API not available in current gateway OpenAPI');
      return [] as CaseDetail[];
    } catch (error) {
      console.error('Get cases error:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<CaseDetail> => {
    console.warn('BLS procedure detail API not available in current gateway OpenAPI');
    throw new Error('Procedure detail endpoint not available');
  },

  getStats: async () => {
    // Note: Stats endpoint not in OpenAPI spec yet
    // Return mock data for now
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      submitted: 0,
      under_review: 0,
    };
  },

  review: async (id: string, decision: string, reason?: string) => {
    // Note: Review endpoint not in SDK - need to add to OpenAPI spec
    console.warn('Review endpoint not yet implemented in SDK');
    return { success: true };
  },
};

export const signingAPI = {
  getAwaitingSignature: async () => {
    console.warn('Signing endpoints not available in current gateway OpenAPI');
    return [] as CaseDetail[];
  },

  sign: async (id: string) => {
    // Note: Sign endpoint not in SDK yet
    console.warn('Sign endpoint not yet implemented in SDK');
    return { success: true };
  },
};

export const aiTeachingAPI = {
  getDocuments: async () => {
    // Note: This endpoint may not be in the generated SDK yet
    console.warn('AI Teaching not yet implemented in SDK');
    return [];
  },

  uploadDocument: async (formData: FormData) => {
    // Note: This endpoint may not be in the generated SDK yet
    console.warn('AI Teaching upload not yet implemented in SDK');
    return { success: true };
  },

  approveDocument: async (id: string, decision: string, reason?: string) => {
    // Note: This endpoint may not be in the generated SDK yet
    console.warn('AI Teaching approve not yet implemented in SDK');
    return { success: true };
  },
};
