import { useState, useEffect } from 'react';
import { ProblemEntry } from '../types';
import { getProblemHistory } from '../lib/api';

export const useProblemHistory = () => {
  const [problems, setProblems] = useState<ProblemEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProblemHistory();
        setProblems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || problem.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const subjects = Array.from(new Set(problems.map(p => p.subject)));

  return {
    problems: filteredProblems,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedSubject,
    setSelectedSubject,
    subjects,
    refetch: () => {
      setLoading(true);
      getProblemHistory().then(setProblems).finally(() => setLoading(false));
    },
  };
};