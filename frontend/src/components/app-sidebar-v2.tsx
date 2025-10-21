import * as React from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { ProjectSwitcher } from '@/components/project-switcher'
import { useAuth } from '@/contexts/AuthContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ChevronRight, Home, CheckSquare, Calendar, AlertTriangle, Settings, Users, BarChart3, Bot, FileText } from "lucide-react"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedProjectId?: string | null
  onProjectSelect?: (projectId: string | null) => void
  onCreateProject?: () => void
  onViewAllProjects?: () => void
  projects?: any[]
}

function useNavData() {
  const { projectId } = useParams()
  const location = useLocation()

  const projectBase = projectId ? `/projects/${projectId}` : null

  const isActive = (path: string) => location.pathname.startsWith(path)

  return {
    navMain: [
      {
        title: "Project Management",
        url: projectBase || "/projects",
        items: [
          {
            title: "Overview",
            url: projectBase ? `${projectBase}/overview` : "/projects",
            icon: Home,
            isActive: projectBase ? isActive(`${projectBase}/overview`) : isActive("/projects"),
          },
          {
            title: "Tasks",
            url: projectBase ? `${projectBase}/tasks` : "/projects",
            icon: CheckSquare,
            isActive: projectBase ? isActive(`${projectBase}/tasks`) : false,
          },
          {
            title: "Timeline",
            url: projectBase ? `${projectBase}/timeline` : "/projects",
            icon: Calendar,
            isActive: projectBase ? isActive(`${projectBase}/timeline`) : false,
          },
          {
            title: "Risks",
            url: projectBase ? `${projectBase}/risks` : "/projects",
            icon: AlertTriangle,
            isActive: projectBase ? isActive(`${projectBase}/risks`) : false,
          },
          {
            title: "Documents",
            url: projectBase ? `${projectBase}/documents` : "/projects",
            icon: FileText,
            isActive: projectBase ? isActive(`${projectBase}/documents`) : false,
          },
        ],
      },
      {
        title: "Global",
        items: [
          {
            title: "All Projects",
            url: "/projects",
            icon: BarChart3,
            isActive: isActive("/projects") && !projectBase,
          },
          {
            title: "People",
            url: "/team",
            icon: Users,
            isActive: isActive("/team"),
          },
          {
            title: "AI Configuration",
            url: "/assistant-settings",
            icon: Bot,
            isActive: isActive("/assistant-settings"),
          },
          {
            title: "Settings",
            url: "/settings",
            icon: Settings,
            isActive: isActive("/settings"),
          },
        ],
      },
    ],
  }
}

export function AppSidebarV2({ 
  selectedProjectId,
  onProjectSelect,
  onCreateProject,
  onViewAllProjects,
  projects,
  ...props 
}: AppSidebarProps) {
  const data = useNavData()
  const { user, signOut } = useAuth()
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ProjectSwitcher
          selectedProjectId={selectedProjectId}
          onProjectSelect={onProjectSelect}
          onCreateProject={onCreateProject}
          onViewAllProjects={onViewAllProjects}
          projects={projects}
        />
      </SidebarHeader>
      <SidebarContent>
        {/* Navigation sections */}
        {data.navMain.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      className="w-full justify-start gap-3 px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                        {item.isActive && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.email?.split('@')[0]}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email?.split('@')[1]}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut().catch(console.error)}
              className="text-xs px-2 py-1 rounded-md border border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
