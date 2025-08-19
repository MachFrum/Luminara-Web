import { useState } from 'react';
import { ProblemSubmissionData, ProblemResult } from '../types';
import { submitProblem } from '../lib/api';
import { uploadFile } from '../lib/aws/s3';

export const useProblemSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProblemResult | null>(null);

  const submit = async (data: ProblemSubmissionData): Promise<ProblemResult | null> => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      let submissionData = { ...data };

      // Upload image if present
      if (data.image) {
        try {
          const imageUrl = await uploadFile(data.image);
          submissionData = { ...data, imageUrl } as any;
        } catch (uploadError) {
          setError('Failed to upload image');
          return null;
        }
      }

      const response = await submitProblem(submissionData);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit problem';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
  };

  return {
    submit,
    loading,
    error,
    result,
    reset,
  };
};