import React from 'react';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import { useLeaderboardFilters } from '../../hooks/useLeaderboardFilters';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import LeaderboardFilters from '../../components/leaderboard/LeaderboardFilters';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';

const AdminLeaderboardPage: React.FC = () => {
    // This custom hook now manages all the filter logic and state
    const filterProps = useLeaderboardFilters();

    // This hook fetches the leaderboard data based on the selected filters
    const {
        leaderboardData,
        loading: leaderboardLoading,
        error: leaderboardError,
    } = useLeaderboardData(
        filterProps.selectedContestId,
        filterProps.scope === 'class' ? filterProps.selectedClassId : undefined
    );

    // Combine loading state from filters and data fetching for a smoother UI experience
    const isLoading = filterProps.loading || leaderboardLoading;

    return (
        <AdminPageLayout title="Leaderboard Viewer" error={leaderboardError}>
            <LeaderboardFilters {...filterProps} />

            <div className="bg-base-300 rounded-lg p-2 border border-gray-600">
                {isLoading ? (
                    <div className="text-center p-8">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : leaderboardData &&
                  leaderboardData.leaderboard.length > 0 ? (
                    <LeaderboardTable
                        rows={leaderboardData.leaderboard}
                        cases={leaderboardData.cases}
                    />
                ) : (
                    <div className="text-center p-8 text-gray-400">
                        No leaderboard data available for the selected filters.
                    </div>
                )}
            </div>
        </AdminPageLayout>
    );
};

export default AdminLeaderboardPage;
