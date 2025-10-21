import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import LoginPage from '@/components/auth/LoginPage'
import AuthCallback from '@/components/auth/AuthCallback'
import MainLayout from '@/components/layout/MainLayout'
import DashboardPage from '@/pages/DashboardPage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectPage from '@/pages/ProjectPage'
import AITestPage from '@/pages/AITestPage'
import AssistantSettingsPage from '@/pages/AssistantSettingsPage'
import QuickDiagnostic from '@/pages/QuickDiagnostic'
import NotFound from '@/pages/NotFound'
import ProtectedRoute from '@/components/common/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes with App Sidebar Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProjectsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Project-specific routes */}
          <Route
            path="/projects/:projectId/:view?"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProjectPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Assistant Settings Page */}
          <Route
            path="/assistant-settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AssistantSettingsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* AI Test Page - Phase 3 Demo */}
          <Route
            path="/ai-test"
            element={
              <ProtectedRoute>
                <AITestPage />
              </ProtectedRoute>
            }
          />

          {/* Quick Diagnostic */}
          <Route
            path="/quick-check"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <QuickDiagnostic />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

