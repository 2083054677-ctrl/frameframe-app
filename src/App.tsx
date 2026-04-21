import React from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import NewProject from './pages/NewProject'
import Editor from './pages/Editor'
import Export from './pages/Export'
import Settings from './pages/Settings'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ef4444' }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#64748b' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
                  style={{ marginTop: 16, padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            回到首页
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: '#cbd5e1' }}>404</h1>
      <p style={{ fontSize: 16, color: '#64748b', marginTop: 8 }}>页面不存在</p>
      <Link to="/" style={{ marginTop: 24, padding: '8px 20px', background: '#2563eb', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
        回到首页
      </Link>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new" element={<NewProject />} />
          <Route path="/project/:id" element={<Editor />} />
          <Route path="/project/:id/export" element={<Export />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  )
}

export default App
