import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'Arial, sans-serif',
          background: '#fee2e2',
          minHeight: '100vh',
          color: '#dc2626'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>🚨 Something went wrong!</h1>
          <details style={{ whiteSpace: 'pre-wrap', background: 'white', padding: '20px', borderRadius: '8px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
              Click to see error details
            </summary>
            <div>
              <h3>Error:</h3>
              <p>{this.state.error && this.state.error.toString()}</p>
              
              <h3>Component Stack:</h3>
              <p>{this.state.errorInfo.componentStack}</p>
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
