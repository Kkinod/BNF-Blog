import { renderHook, act } from "@testing-library/react";
import { toast } from "sonner";
import * as firebaseStorage from "firebase/storage";
import { useImageUpload } from "./useImageUpload";
import { labels } from "@/shared/utils/labels";

// Define types for callbacks to avoid "Unsafe call of an `any` typed value" errors
type ProgressCallback = (snapshot: { bytesTransferred: number; totalBytes: number }) => void;
type ErrorCallback = (error: Error) => void;
type SuccessCallback = () => void;

// Mock dependencies
jest.mock("sonner", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
		info: jest.fn(),
	},
}));

jest.mock("firebase/storage", () => ({
	getStorage: jest.fn(),
	ref: jest.fn(),
	uploadBytesResumable: jest.fn().mockReturnValue({
		on: jest.fn(),
		cancel: jest.fn(),
		snapshot: {
			ref: "mockRef",
		},
	}),
	getDownloadURL: jest.fn().mockResolvedValue("https://example.com/test.png"),
}));

describe("useImageUpload", () => {
	// Mock file for testing
	const mockFile = new File(["test"], "test.png", { type: "image/png" });
	const mockDownloadURL = "https://example.com/test.png";

	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Test initial state
	it("should initialize with default values", () => {
		const { result } = renderHook(() => useImageUpload());

		expect(result.current.imageUrl).toBe("");
		expect(result.current.uploadProgress).toBe(0);
		expect(result.current.error).toBeNull();
		expect(result.current.isUploading).toBe(false);
	});

	// Test setFile function
	it("should update file when setFile is called", () => {
		const { result } = renderHook(() => useImageUpload());

		act(() => {
			result.current.setFile(mockFile);
		});

		// This will trigger the upload process, so we should see isUploading become true
		expect(result.current.isUploading).toBe(true);
		expect(firebaseStorage.uploadBytesResumable).toHaveBeenCalled();
	});

	// Test upload progress
	it("should update upload progress", () => {
		const { result } = renderHook(() => useImageUpload());

		// Setup the mock to trigger the progress callback
		const mockOn = jest
			.fn()
			.mockImplementation((event: string, progressCallback: ProgressCallback) => {
				progressCallback({
					bytesTransferred: 50,
					totalBytes: 100,
				});
			});

		// Override the default mock implementation for this test
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
			on: mockOn,
			cancel: jest.fn(),
			snapshot: { ref: "mockRef" },
		});

		act(() => {
			result.current.setFile(mockFile);
		});

		expect(result.current.uploadProgress).toBe(50);
	});

	// Test successful upload
	it("should handle successful upload", async () => {
		const { result } = renderHook(() => useImageUpload());

		// Setup the mock to trigger the success callback
		const mockOn = jest
			.fn()
			.mockImplementation(
				(
					event: string,
					progressCallback: ProgressCallback,
					errorCallback: ErrorCallback,
					successCallback: SuccessCallback,
				) => {
					successCallback();
				},
			);

		// Override the default mock implementation for this test
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
			on: mockOn,
			cancel: jest.fn(),
			snapshot: { ref: "mockRef" },
		});

		act(() => {
			result.current.setFile(mockFile);
		});

		// Wait for the async operations to complete
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.imageUrl).toBe(mockDownloadURL);
		expect(result.current.isUploading).toBe(false);
		expect(toast.success).toHaveBeenCalledWith(labels.writePost.uploadSuccess);
	});

	// Test upload error
	it("should handle upload error", () => {
		const { result } = renderHook(() => useImageUpload());

		// Setup the mock to trigger the error callback
		const mockOn = jest
			.fn()
			.mockImplementation(
				(event: string, progressCallback: ProgressCallback, errorCallback: ErrorCallback) => {
					errorCallback(new Error("Upload failed"));
				},
			);

		// Override the default mock implementation for this test
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
			on: mockOn,
			cancel: jest.fn(),
			snapshot: { ref: "mockRef" },
		});

		act(() => {
			result.current.setFile(mockFile);
		});

		expect(result.current.error).toBe(labels.errors.uploadFailed);
		expect(result.current.isUploading).toBe(false);
		expect(toast.error).toHaveBeenCalledWith(labels.errors.uploadFailed);
	});

	// Test download URL error
	it("should handle download URL error", async () => {
		const { result } = renderHook(() => useImageUpload());

		// Setup the mock to trigger the success callback but fail on getDownloadURL
		const mockOn = jest
			.fn()
			.mockImplementation(
				(
					event: string,
					progressCallback: ProgressCallback,
					errorCallback: ErrorCallback,
					successCallback: SuccessCallback,
				) => {
					successCallback();
				},
			);

		// Override the default mock implementation for this test
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
			on: mockOn,
			cancel: jest.fn(),
			snapshot: { ref: "mockRef" },
		});

		(firebaseStorage.getDownloadURL as jest.Mock).mockRejectedValueOnce(
			new Error("Download URL failed"),
		);

		act(() => {
			result.current.setFile(mockFile);
		});

		// Wait for the async operations to complete
		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.error).toBe(labels.errors.downloadUrlFailed);
		expect(result.current.isUploading).toBe(false);
		expect(toast.error).toHaveBeenCalledWith(labels.errors.downloadUrlFailed);
	});

	// Test cancel upload
	it("should cancel upload when cancelUpload is called", () => {
		const { result } = renderHook(() => useImageUpload());

		const mockCancel = jest.fn();

		// Override the default mock implementation for this test
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
			on: jest.fn(),
			cancel: mockCancel,
			snapshot: { ref: "mockRef" },
		});

		act(() => {
			result.current.setFile(mockFile);
		});

		act(() => {
			result.current.cancelUpload();
		});

		expect(mockCancel).toHaveBeenCalled();
		expect(result.current.isUploading).toBe(false);
		expect(result.current.error).toBe(labels.errors.uploadCancelled);
		expect(toast.info).toHaveBeenCalledWith(labels.errors.uploadCancelled);
	});

	// Test reset upload
	it("should reset state when resetUpload is called", () => {
		const { result } = renderHook(() => useImageUpload());

		const mockCancel = jest.fn();

		// Override the default mock implementation for this test
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
			on: jest.fn(),
			cancel: mockCancel,
			snapshot: { ref: "mockRef" },
		});

		act(() => {
			result.current.setFile(mockFile);
		});

		act(() => {
			result.current.resetUpload();
		});

		expect(mockCancel).toHaveBeenCalled();
		expect(result.current.imageUrl).toBe("");
		expect(result.current.uploadProgress).toBe(0);
		expect(result.current.error).toBeNull();
		expect(result.current.isUploading).toBe(false);
	});

	// Test cleanup on unmount
	it("should cancel active upload on unmount", () => {
		// Create a mock cancel function that we can track
		const mockCancel = jest.fn();

		// Setup the mock upload task with our trackable cancel function
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockReturnValueOnce({
			on: jest.fn(),
			cancel: mockCancel,
			snapshot: { ref: "mockRef" },
		});

		// Render the hook and get access to the result and unmount function
		const { result, unmount } = renderHook(() => useImageUpload());

		// Set a file to start the upload process
		act(() => {
			result.current.setFile(mockFile);
		});

		// Verify that the upload has started
		expect(firebaseStorage.uploadBytesResumable).toHaveBeenCalled();

		// Now unmount the component
		unmount();

		// Verify that the cancel function was called during cleanup
		expect(mockCancel).toHaveBeenCalled();
	});

	// Test unexpected error during setup
	it("should handle unexpected errors during upload setup", () => {
		// Mock an error during setupUploadTask
		(firebaseStorage.uploadBytesResumable as jest.Mock).mockImplementationOnce(() => {
			throw new Error("Unexpected error");
		});

		const { result } = renderHook(() => useImageUpload());

		act(() => {
			result.current.setFile(mockFile);
		});

		expect(result.current.error).toBe(labels.errors.unexpectedUploadError);
		expect(result.current.isUploading).toBe(false);
		expect(toast.error).toHaveBeenCalledWith(labels.errors.unexpectedUploadError);
	});
});
