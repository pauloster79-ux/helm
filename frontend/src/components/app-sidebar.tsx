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
        title: "Project",
        url: projectBase || "/projects",
        items: [
          {
            title: "Overview",
            url: projectBase ? `${projectBase}/overview` : "/projects",
            isActive: projectBase ? isActive(`${projectBase}/overview`) : isActive("/projects"),
          },
          {
            title: "Tasks",
            url: projectBase ? `${projectBase}/tasks` : "/projects",
            isActive: projectBase ? isActive(`${projectBase}/tasks`) : false,
          },
          {
            title: "Timeline",
            url: projectBase ? `${projectBase}/timeline` : "/projects",
            isActive: projectBase ? isActive(`${projectBase}/timeline`) : false,
          },
          {
            title: "Risks",
            url: projectBase ? `${projectBase}/risks` : "/projects",
            isActive: projectBase ? isActive(`${projectBase}/risks`) : false,
          },
        ],
      },
      {
        title: "Global",
        url: "/",
        items: [
          { title: "All Projects", url: "/projects", isActive: isActive("/projects") },
          { title: "Resources", url: "/resources" },
        ],
      },
    ],
  }
}

export function AppSidebar({ 
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
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="mt-auto p-3 border-t border-sidebar-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-secondary-foreground">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email}
              </span>
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
