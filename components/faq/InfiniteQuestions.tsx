// components/faq/InfiniteQuestions.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useCallback } from 'react';
import { Loader } from "lucide-react";
import ShowQuastion from "@/components/faq/quastion/ShowQuastion";
import { GetQuestions } from "@/actions/faq/answerFilter";

const ITEMS_PER_PAGE = 10;

interface Filters {
    tag: string;
    search: string;
    mode: string;
    sort: string;
}

interface InfiniteQuestionsProps {
    initialQuestions: any[];
    initialFilters: Filters;
}

export default function InfiniteQuestions({ 
    initialQuestions, 
    initialFilters 
}: InfiniteQuestionsProps) {
    const [questions, setQuestions] = useState<any[]>(initialQuestions || []);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
        delay: 500 // Add delay to prevent rapid firing
    });

    const loadMoreQuestions = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            
            const { QuestionsWithAnswers } = await GetQuestions(
                filters.tag,
                filters.search,
                filters.mode,
                filters.sort,
                page,
                ITEMS_PER_PAGE
            );

            if (!QuestionsWithAnswers || QuestionsWithAnswers.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (QuestionsWithAnswers && QuestionsWithAnswers.length > 0) {
                setQuestions(prev => [...prev, ...QuestionsWithAnswers]);
                setPage(prev => prev + 1);
            } else {
                setHasMore(false);
            }

        } catch (error) {
            console.error('Error loading questions:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [filters, page, loading, hasMore]); // Add all dependencies

    // Reset when filters change
    useEffect(() => {
        const filtersChanged = JSON.stringify(filters) !== JSON.stringify(initialFilters);
        if (filtersChanged) {
            setQuestions(initialQuestions || []);
            setPage(2);
            setHasMore(true);
            setFilters(initialFilters);
        }
    }, [initialFilters]); // Remove initialQuestions from dependencies

    // Load more when scrolling to bottom
    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreQuestions();
        }
    }, [inView, hasMore, loading, loadMoreQuestions]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Questions List */}
            {Array.isArray(questions) && questions.length > 0 ? (
                questions.map((item) => (
                    <ShowQuastion item={item} key={item.id} />
                ))
            ) : (
                <div className="text-center py-4">
                    Loading initial questions...
                </div>
            )}

            {/* Loading/End Indicator */}
            <div 
                ref={ref} 
                className="h-20 flex items-center justify-center mt-4"
            >
                {loading && (
                    <NoMoreQuestions title="Loading more questions..." />
                )}
                {!hasMore && questions.length > 0 && (
                    <div className="flex items-center justify-center text-xl font-cairo font-bold w-full h-32 bg-yellowColor rounded-lg text-blueColor">
                        No more questions to load
                    </div>
                )}
            </div>
        </div>
    );
}

const NoMoreQuestions = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center text-xl font-cairo font-bold w-full h-32 bg-yellowColor rounded-lg text-blueColor flex-col gap-4">
        {title}
        <Loader className="text-4xl animate-spin" size={50} />
    </div>
);