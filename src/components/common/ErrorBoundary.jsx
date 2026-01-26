import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-8">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <p className="font-mono text-sm text-red-800 break-all">
                                {this.state.error && this.state.error.toString()}
                            </p>
                        </div>
                        <details className="whitespace-pre-wrap font-mono text-xs text-gray-500 bg-gray-100 p-4 rounded overflow-auto max-h-96">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
