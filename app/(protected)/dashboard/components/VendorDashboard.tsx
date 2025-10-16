"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";

// Mock data types
interface AnalyticsData {
	timestamp: Date;
}
interface VendorDashboardProps {
	userId: string;
}

export default function VendorDashboard({ userId }: VendorDashboardProps) {
	const [listings, setListings] = useState<number>(0);
	const [followers, setFollowers] = useState<number>(0);
	const [impressions, setImpressions] = useState<number>(0);
	const [productViews, setProductViews] = useState<number>(0);
	const [whatsappClicks, setWhatsappClicks] = useState<number>(0);
	const [phoneClicks, setPhoneClicks] = useState<number>(0);
	const router = useRouter();

	// Generate mock data
	useEffect(() => {
		setListings(8);
		setFollowers(17);
		setImpressions(1500);
		setProductViews(450);
		setWhatsappClicks(80);
		setPhoneClicks(45);
	}, []);

	// Simple metric card component matching the HTML design
	const SimpleMetricCard = ({
		title,
		value,
		subtitle,
		icon,
		action,
	}: {
		title: string;
		value: string;
		subtitle: string;
		icon: React.ReactNode;
		action?: { label: string; onClick: () => void };
	}) => (
		<Card className="bg-white border border-gray-200 rounded-xl p-2 sm:p-5 shadow-sm w-full">
			<CardContent className="p-0">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full flex-shrink-0">
								{icon}
							</div>
							<h3 className="font-semibold text-gray-600 text-sm sm:text-base">
								{title}
							</h3>
						</div>
						<p className="text-3xl sm:text-4xl font-bold text-gray-800">
							{value}
						</p>
						{subtitle && (
							<p className="text-sm text-gray-500 mt-1">{subtitle}</p>
						)}
					</div>

					{action && (
						<Button
							onClick={action.onClick}
							className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 sm:px-4 py-2 w-full sm:w-auto"
						>
							{action.label}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);

	// Small metric card for the grid
	const SmallMetricCard = ({
		title,
		value,
		subtitle,
		icon,
	}: {
		title: string;
		value: string;
		subtitle: string;
		icon: React.ReactNode;
	}) => (
		<Card className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm w-full h-full">
			<CardContent className="p-0 h-full">
				<div className="flex flex-col h-full">
					<div className="flex items-center gap-2 mb-3">
						<div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full flex-shrink-0">
							{icon}
						</div>
						<h3 className="font-semibold text-gray-600 text-sm sm:text-base">
							{title}
						</h3>
					</div>
					<div className="flex-grow">
						<p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
							{value}
						</p>
						<p className="text-sm text-gray-500 mt-1 sm:mt-2">{subtitle}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Icons as components for better reusability
	const ListIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 6h16M4 10h16M4 14h16M4 18h16"
			/>
		</svg>
	);

	const UsersIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
			/>
		</svg>
	);

	const EyeIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
			/>
		</svg>
	);

	const TrendingIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
			/>
		</svg>
	);

	const WhatsAppIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			fill="currentColor"
			viewBox="0 0 16 16"
		>
			<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
		</svg>
	);

	const PhoneIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
			/>
		</svg>
	);

	return (
		<div className="min-h-screen  p-3 sm:p-4 md:p-6">
			<div className="max-w-2xl mx-auto w-full">
				{/* Main Metrics Grid */}
				<div className="space-y-4 sm:space-y-5">
					{/* Large Cards - Stack on mobile, side by side on tablet+ */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4">
						<SimpleMetricCard
							title="Total Published Listings"
							value={listings.toString()}
							subtitle=""
							icon={<ListIcon />}
							action={{
								label: "View Listings",
								onClick: () => router.push(`/dashboard/listings`),
							}}
						/>

						<SimpleMetricCard
							title="Total Followers"
							value={followers.toString()}
							subtitle=""
							icon={<UsersIcon />}
							action={{
								label: "View Followers",
								onClick: () => router.push(`/dashboard/followers`),
							}}
						/>
					</div>

					{/* Small Cards Grid - Responsive columns */}
					<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
						<SmallMetricCard
							title="Impressions"
							value="1,500"
							subtitle="All Time"
							icon={<TrendingIcon />}
						/>

						<SmallMetricCard
							title="Product Views"
							value="450"
							subtitle="All Time"
							icon={<EyeIcon />}
						/>

						<SmallMetricCard
							title="WhatsApp Clicks"
							value={whatsappClicks.toString()}
							subtitle="All Time Clicks"
							icon={<WhatsAppIcon />}
						/>

						<SmallMetricCard
							title="Phone Clicks"
							value={phoneClicks.toString()}
							subtitle="All Time Clicks"
							icon={<PhoneIcon />}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
