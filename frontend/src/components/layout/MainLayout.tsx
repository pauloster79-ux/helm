import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebarV2 as AppSidebar } from '@/components/app-sidebar-v2'
import { AssistantPane } from '@/components/ai/AssistantPane'
import CreateProjectForm from '../projects/CreateProjectForm'

interface MainLayoutProps {
  children: React.ReactNode
  selectedProjectId?: string | null
  onProjectSelect?: (projectId: string | null) => void
  onCreateProject?: () => void
  onViewAllProjects?: () => void
  activeView?: 'overview' | 'tasks' | 'risks' | 'timeline' | 'documents'
  onViewChange?: (view: 'overview' | 'tasks' | 'risks' | 'timeline' | 'documents') => void
  projects?: any[]
}

export default function MainLayout({ 
  children, 
  selectedProjectId, 
  onProjectSelect, 
  onCreateProject, 
  onViewAllProjects,
  activeView,
  projects: externalProjects
}: MainLayoutProps) {
  const params = useParams()
  const navigate = useNavigate()
  const { projects: hookProjects } = useProjects()
  const projects = externalProjects || hookProjects
  const [selectedProject, setSelectedProject] = useState<string | null>(params.projectId || selectedProjectId || null)
  const [selectedView, setSelectedView] = useState<'overview' | 'tasks' | 'risks' | 'timeline' | 'documents'>(
    (params.view as any) || activeView || 'overview'
  )
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(true) // Start minimized

  // Keep internal state in sync with route changes
  useEffect(() => {
    if (params.projectId && params.projectId !== selectedProject) {
      setSelectedProject(params.projectId)
    }
    if (params.view && params.view !== selectedView) {
      setSelectedView(params.view as any)
    }
  }, [params.projectId, params.view, selectedProject, selectedView])

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId)
    setSelectedView('overview') // Reset to overview when project changes
    onProjectSelect?.(projectId)
    if (projectId) {
      navigate(`/projects/${projectId}/overview`)
    } else {
      navigate(`/projects`)
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        selectedProjectId={selectedProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={() => {
          setShowCreateProject(true)
          onCreateProject?.()
        }}
        onViewAllProjects={onViewAllProjects}
        projects={projects}
      />
      <SidebarInset className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-l border-sidebar-border px-4 w-full relative">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-bold">Helm</h1>
          </div>
        </header>

        {/* Main Content Area with Assistant Pane */}
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]">
          {/* Main Content */}
          <div className={`flex-1 overflow-hidden transition-all duration-200 ${isAssistantCollapsed ? '' : 'mr-0'}`}>
            <div className="flex flex-col gap-4 p-4 h-full min-h-0 overflow-hidden">
              {showCreateProject ? (
                <CreateProjectForm
                  onProjectCreated={() => {
                    setShowCreateProject(false)
                  }}
                  onCancel={() => setShowCreateProject(false)}
                />
              ) : (
                children
              )}
            </div>
          </div>

          {/* Assistant Pane - Always Present, Minimized by Default */}
          <div className={`transition-all duration-200 h-full ${isAssistantCollapsed ? 'w-16' : 'w-[30%] min-w-[400px]'}`}>
            <AssistantPane
              projectId={selectedProject || undefined}
              collapsed={isAssistantCollapsed}
              onCollapse={setIsAssistantCollapsed}
              className="h-full"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
