import React, { useState, useRef, useEffect } from 'react';
import {
    Upload,
    X,
    File,
    Image as ImageIcon,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModernFileUpload = ({
    fileType = "image",
    uploadedFile = null,
    onFileUpload,
    onRemove,
    label = "Upload File",
    required = false,
    error = null
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [internalError, setInternalError] = useState(null);
    const inputRef = useRef(null);

    // Image Preview Logic
    useEffect(() => {
        if (uploadedFile && fileType === "image") {
            // If it's a File object, create object URL
            if (uploadedFile instanceof File) {
                const objectUrl = URL.createObjectURL(uploadedFile);
                setPreviewUrl(objectUrl);
                return () => URL.revokeObjectURL(objectUrl);
            }
            // If it's a string (e.g., existing URL or base64 passed from parent)
            else if (typeof uploadedFile === 'string') {
                setPreviewUrl(uploadedFile);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [uploadedFile, fileType]);

    const validateFile = (file) => {
        setInternalError(null);

        // Size validation (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setInternalError("File size exceeds 5MB limit.");
            return false;
        }

        // Type validation
        if (fileType === "image" && !file.type.startsWith("image/")) {
            setInternalError("Please upload a valid image file (JPG, PNG, GIF).");
            return false;
        }

        return true;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                onFileUpload(file);
            }
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                onFileUpload(file);
            }
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (previewUrl && uploadedFile instanceof File) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        onRemove();
        // Reset input value to allow re-uploading same file
        if (inputRef.current) inputRef.current.value = '';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const displayError = error || internalError;

    return (
        <div className="w-full space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <AnimatePresence mode="wait">
                {uploadedFile ? (
                    // Uploaded State
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative rounded-2xl border-2 border-dashed ${displayError ? 'border-red-500 bg-red-50' : 'border-green-300 bg-green-50/30'} p-4 transition-all duration-300 group`}
                    >
                        {fileType === "image" && previewUrl ? (
                            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <File size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                                        {uploadedFile.name || "Uploaded File"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {uploadedFile.size ? formatFileSize(uploadedFile.size) : 'Ready'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Remove Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleRemove}
                            type="button"
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                        >
                            <X size={16} />
                        </motion.button>

                        {/* Success Indicator (if no error) */}
                        {!displayError && (
                            <div className="absolute top-2 left-2 px-3 py-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                                <CheckCircle2 size={12} /> Uploaded
                            </div>
                        )}
                    </motion.div>
                ) : (
                    // Empty / Drag State
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            className={`
                                relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300
                                ${isDragging
                                    ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-blue-100 scale-[1.02] shadow-xl shadow-purple-100'
                                    : 'border-gray-300 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-50 hover:to-blue-50'
                                }
                                ${displayError ? 'border-red-500 bg-red-50' : ''}
                            `}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileInput}
                                accept={fileType === "image" ? "image/png, image/jpeg, image/gif, image/webp" : "*"}
                            />

                            <div className="flex flex-col items-center gap-3">
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                                    ${isDragging ? 'bg-white text-purple-600 shadow-md scale-110' : 'bg-white/80 text-purple-500 shadow-sm'}
                                `}>
                                    <Upload
                                        size={32}
                                        className={`transition-transform duration-300 ${isDragging ? 'animate-bounce' : 'group-hover:scale-110'}`}
                                    />
                                </div>

                                <div>
                                    <p className="text-lg font-bold text-gray-700">
                                        {isDragging ? "Drop to upload" : "Drag & drop or click to upload"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {fileType === "image" ? "SVG, PNG, JPG or GIF (Max 5MB)" : "Max 5MB"}
                                    </p>
                                </div>
                            </div>

                            {displayError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-4 left-0 right-0 flex justify-center text-red-500 text-sm font-medium items-center gap-1"
                                >
                                    <AlertCircle size={14} /> {displayError}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModernFileUpload;
