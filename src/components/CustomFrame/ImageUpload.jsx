import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ onFilesChange, maxFiles = 5 }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return 'Only JPG, PNG and WEBP files are allowed.';
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB Limit
            return 'File size must be less than 5MB.';
        }
        return null;
    };

    const handleFiles = (newFiles) => {
        setError('');
        const filesToProcess = Array.from(newFiles);

        if (files.length + filesToProcess.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} images.`);
            return;
        }

        const processedFilePromises = filesToProcess.map(file => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                return Promise.resolve(null);
            }

            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const img = new Image();
                    img.onload = () => {
                        resolve({
                            file,
                            preview: reader.result,
                            id: Math.random().toString(36).substr(2, 9),
                            lowRes: img.width < 1000 || img.height < 1000,
                            width: img.width,
                            height: img.height
                        });
                    };
                    img.onerror = () => resolve(null);
                    img.src = reader.result;
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(processedFilePromises).then(results => {
            const validProcessedFiles = results.filter(f => f !== null);
            if (validProcessedFiles.length > 0) {
                const updatedFiles = [...files, ...validProcessedFiles];
                setFiles(updatedFiles);
                if (onFilesChange) {
                    onFilesChange(updatedFiles);
                }
            }
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const removeFile = (idToRemove) => {
        const updatedFiles = files.filter(f => f.id !== idToRemove);
        setFiles(updatedFiles);
        if (onFilesChange) {
            onFilesChange(updatedFiles);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group ${isDragging
                    ? 'border-[#EA7704] bg-orange-50'
                    : 'border-gray-300 hover:border-[#EA7704] hover:bg-gray-50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    onChange={(e) => handleFiles(e.target.files)}
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-orange-100 text-[#EA7704]' : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-[#EA7704]'}`}>
                        <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-700 font-medium">
                            Drag & Drop photos here or <span className="text-[#EA7704] font-bold">Choose File</span>
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Supported: JPG, PNG, WEBP (Max 5MB)
                        </p>
                        <p className="text-xs text-[#EA7704] mt-2 font-medium">
                            Recommended: &gt;1000px width for best quality
                        </p>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center text-red-500 text-sm bg-red-50 p-2 rounded-lg"
                    >
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {files.length > 0 && (
                <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {files.map((file) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                layout
                                className="relative aspect-square rounded-xl overflow-hidden shadow-sm group border border-gray-200"
                            >
                                <img
                                    src={file.preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                {file.lowRes && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-yellow-400/90 text-yellow-900 text-[10px] font-bold px-1 py-1 flex items-center justify-center gap-1 z-10">
                                        <AlertTriangle className="w-3 h-3" />
                                        Low Quality
                                    </div>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(file.id);
                                    }}
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow-lg transition-transform hover:scale-110 z-20 opacity-0 group-hover:opacity-100"
                                    title="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
