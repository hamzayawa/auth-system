"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */
const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */
interface ProfileFormData {
	name: string;
}

interface ValidationErrors {
	name?: string;
	image?: string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */
export default function ProfileUpdateForm({
	user,
}: {
	user: {
		name: string;
		email: string;
		image?: string | null;
	};
}) {
	const router = useRouter();

	const [formData, setFormData] = useState<ProfileFormData>({
		name: user.name,
	});

	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		user.image ?? null,
	);

	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	/* ----------------------------- handlers ----------------------------- */
	const handleNameChange = (value: string) => {
		setFormData({ name: value });
		if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
	};

	const handleImageChange = (file: File | null) => {
		if (!file) return;

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			setErrors((e) => ({
				...e,
				image: "Only JPG, PNG or WEBP images are allowed.",
			}));
			return;
		}

		if (file.size > MAX_IMAGE_SIZE_BYTES) {
			setErrors((e) => ({
				...e,
				image: `Image must be less than ${MAX_IMAGE_SIZE_MB}MB.`,
			}));
			return;
		}

		setErrors((e) => ({ ...e, image: undefined }));
		setProfileImage(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	/* ----------------------------- validation ----------------------------- */
	const validateName = () =>
		formData.name.trim() ? undefined : "Name is required.";

	// ✅ Check if any changes happened compared to original
	const hasChanges =
		formData.name.trim() !== user.name || profileImage !== null;

	const isFormValid =
		formData.name.trim() &&
		Object.values(errors).every((e) => !e) &&
		hasChanges;

	/* ----------------------------- submit ----------------------------- */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) return;

		setIsSubmitting(true);

		try {
			let imageUrl = user.image ?? undefined;

			if (profileImage) {
				imageUrl = await uploadProfileImage(profileImage);
			}

			const res = await authClient.updateUser({
				name: formData.name,
				image: imageUrl,
			});

			if (res.error) {
				toast.error(res.error.message || "Failed to update profile");
			} else {
				toast.success("Profile updated successfully");
				router.refresh();
				setProfileImage(null); // reset image change after success
			}
		} catch (err: any) {
			toast.error(err.message || "Something went wrong");
		}

		setIsSubmitting(false);
	};

	/* ----------------------------- UI ----------------------------- */
	return (
		<motion.div
			className="w-full max-w-lg"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border p-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold">Update Profile</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Avatar */}
					<div className="flex flex-col items-center gap-3">
						<motion.div
							className="relative size-28 rounded-full overflow-hidden border"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							key={previewUrl} // re-animate when image changes
						>
							<Image
								src={previewUrl || "/avatar-placeholder.png"}
								alt="Profile picture"
								fill
								className="object-cover"
							/>

							<label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition">
								<Camera className="text-white" />
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) =>
										handleImageChange(e.target.files?.[0] ?? null)
									}
								/>
							</label>
						</motion.div>

						<p className="text-xs text-muted-foreground">
							JPG, PNG or WEBP • Max {MAX_IMAGE_SIZE_MB}MB
						</p>

						{errors.image && (
							<p className="text-sm text-destructive">{errors.image}</p>
						)}
					</div>

					{/* Name */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<AnimatedInput
							id="name"
							type="text"
							label="Name"
							value={formData.name}
							onChange={handleNameChange}
							onBlur={() => setErrors((e) => ({ ...e, name: validateName() }))}
							error={errors.name}
							required
						/>
					</motion.div>

					{/* Email (locked) */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<AnimatedInput
							id="email"
							type="email"
							label="Email"
							value={user.email}
							disabled
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.9 }}
					>
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							<Button
								type="submit"
								disabled={isSubmitting || !isFormValid}
								className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-full"
							>
								{isSubmitting ? (
									<>
										<LoadingSpinner
											size={20}
											barWidth={2}
											barLength={5}
											numBars={12}
											className="mr-2"
										/>
										Updating...
									</>
								) : (
									<>
										Update Profile
										<ArrowRight className="ml-2 size-5" />
									</>
								)}
							</Button>
						</motion.div>
					</motion.div>
				</form>
			</div>
		</motion.div>
	);
}

/* ------------------------------------------------------------------ */
/* Local upload helper */
/* ------------------------------------------------------------------ */
async function uploadProfileImage(file: File): Promise<string> {
	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch("/api/upload/avatar", {
		method: "POST",
		body: formData,
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Image upload failed");
	}

	const data = await res.json();
	return data.url; // Cloudinary URL
}
