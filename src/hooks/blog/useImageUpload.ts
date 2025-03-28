import { useCallback, useEffect, useReducer, useRef } from "react";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
	type UploadTask,
} from "firebase/storage";
import { toast } from "sonner";
import { app } from "@/shared/utils/firebase";
import { labels } from "@/shared/utils/labels";

const storage = getStorage(app);
// 1.5 MB in bytes
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

type State = {
	file: File | null;
	imageUrl: string;
	uploadProgress: number;
	error: string | null;
	isUploading: boolean;
};

type Action =
	| { type: "SET_FILE"; payload: File | null }
	| { type: "UPLOAD_START" }
	| { type: "UPLOAD_PROGRESS"; payload: number }
	| { type: "UPLOAD_SUCCESS"; payload: string }
	| { type: "UPLOAD_ERROR"; payload: string }
	| { type: "UPLOAD_CANCEL" }
	| { type: "SET_IMAGE_URL"; payload: string }
	| { type: "RESET" };

const initialState: State = {
	file: null,
	imageUrl: "",
	uploadProgress: 0,
	error: null,
	isUploading: false,
};

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "SET_FILE":
			return { ...state, file: action.payload };
		case "UPLOAD_START":
			return { ...state, isUploading: true, error: null, uploadProgress: 0 };
		case "UPLOAD_PROGRESS":
			return { ...state, uploadProgress: action.payload };
		case "UPLOAD_SUCCESS":
			return { ...state, imageUrl: action.payload, isUploading: false };
		case "UPLOAD_ERROR":
			toast.error(action.payload);
			return { ...state, error: action.payload, isUploading: false };
		case "UPLOAD_CANCEL":
			toast.info(labels.errors.uploadCancelled);
			return { ...state, isUploading: false, error: labels.errors.uploadCancelled, file: null };
		case "SET_IMAGE_URL":
			return { ...state, imageUrl: action.payload };
		case "RESET":
			return initialState;
		default:
			return state;
	}
}

export const useImageUpload = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { file, imageUrl, uploadProgress, error, isUploading } = state;

	const uploadTaskRef = useRef<UploadTask | null>(null);

	const cancelActiveUpload = useCallback(() => {
		if (uploadTaskRef.current) {
			uploadTaskRef.current.cancel();
			uploadTaskRef.current = null;
		}
	}, []);

	const setFile = useCallback((newFile: File | null) => {
		// Check file size if a file is provided
		if (newFile) {
			if (newFile.size > MAX_FILE_SIZE) {
				toast.error(labels.errors.imageTooLarge);
				return;
			}
		}

		dispatch({ type: "SET_FILE", payload: newFile });
	}, []);

	const resetUpload = useCallback(() => {
		cancelActiveUpload();
		dispatch({ type: "RESET" });
	}, [cancelActiveUpload]);

	const cancelUpload = useCallback(() => {
		cancelActiveUpload();
		dispatch({ type: "UPLOAD_CANCEL" });
	}, [cancelActiveUpload]);

	const setupUploadTask = useCallback((fileToUpload: File) => {
		const fileName = new Date().getTime() + fileToUpload.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

		uploadTaskRef.current = uploadTask;

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				dispatch({ type: "UPLOAD_PROGRESS", payload: progress });
			},
			(error) => {
				if (process.env.NODE_ENV === "development") {
					console.error("[DEV] Upload error:", error);
				}
				dispatch({ type: "UPLOAD_ERROR", payload: labels.errors.uploadFailed });
			},
			async () => {
				try {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
					dispatch({ type: "UPLOAD_SUCCESS", payload: downloadURL });
					toast.success(labels.writePost.uploadSuccess);
					uploadTaskRef.current = null;
				} catch (error) {
					if (process.env.NODE_ENV === "development") {
						console.error("[DEV] Download URL error:", error);
					}
					dispatch({
						type: "UPLOAD_ERROR",
						payload: labels.errors.downloadUrlFailed,
					});
					uploadTaskRef.current = null;
				}
			},
		);
	}, []);

	const setImageUrl = useCallback((url: string) => {
		dispatch({ type: "SET_IMAGE_URL", payload: url });
	}, []);

	useEffect(() => {
		if (!file) return;

		dispatch({ type: "UPLOAD_START" });

		try {
			setupUploadTask(file);
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("[DEV] Unexpected upload error:", error);
			}
			dispatch({
				type: "UPLOAD_ERROR",
				payload: labels.errors.unexpectedUploadError,
			});
		}

		return cancelActiveUpload;
	}, [file, setupUploadTask, cancelActiveUpload]);

	return {
		setFile,
		imageUrl,
		uploadProgress,
		error,
		isUploading,
		resetUpload,
		cancelUpload,
		setImageUrl,
	};
};
