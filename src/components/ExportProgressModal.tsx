import React from 'react';
import { Loader2, CheckCircle, XCircle, Download } from 'lucide-react';

interface ExportProgressModalProps {
    isOpen: boolean;
    progress: number;
    status: 'idle' | 'recording' | 'processing' | 'completed' | 'error';
    error?: string;
    onClose: () => void;
    onDownload?: () => void;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
    isOpen,
    progress,
    status,
    error,
    onClose,
    onDownload
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 transform transition-all">
                <div className="flex flex-col items-center text-center space-y-4">

                    {/* Icon State */}
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50">
                        {status === 'recording' || status === 'processing' ? (
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        ) : status === 'completed' ? (
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        ) : status === 'error' ? (
                            <XCircle className="w-10 h-10 text-red-500" />
                        ) : (
                            <Download className="w-8 h-8 text-gray-400" />
                        )}
                    </div>

                    {/* Title & Description */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {status === 'recording' && 'Recording Video...'}
                            {status === 'processing' && 'Processing...'}
                            {status === 'completed' && 'Export Ready!'}
                            {status === 'error' && 'Export Failed'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {status === 'recording' && 'Please wait while we capture your ad preview.'}
                            {status === 'processing' && 'Preparing your file for download.'}
                            {status === 'completed' && 'Your video has been successfully exported.'}
                            {status === 'error' && (error || 'Something went wrong during export.')}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    {(status === 'recording' || status === 'processing') && (
                        <div className="w-full space-y-2">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>{Math.round(progress)}%</span>
                                <span>{status === 'recording' ? 'Recording' : 'Processing'}</span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="w-full pt-2">
                        {status === 'completed' ? (
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                <span>Done</span>
                            </button>
                        ) : status === 'error' ? (
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        ) : null}
                    </div>

                </div>
            </div>
        </div>
    );
};
