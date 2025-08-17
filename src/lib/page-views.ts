import { supabase } from './supabase';

// Record a page view
export async function recordPageView(url: string) {
	try {
		const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
		const referrer = typeof document !== 'undefined' ? document.referrer : '';
		// IP address is not available from client-side JS, leave blank or use serverless function for more accuracy
		await supabase.from('page_views').insert([
			{
				url,
				user_agent: userAgent,
				referrer,
				// session_id: can be set from cookies/localStorage if needed
			}
		]);
	} catch (error) {
		// Ignore errors for analytics
		console.error('Failed to record page view', error);
	}
}

// Fetch total page views
export async function getTotalPageViews() {
	const { count, error } = await supabase
		.from('page_views')
		.select('*', { count: 'exact', head: true });
	if (error) throw error;
	return count || 0;
}
