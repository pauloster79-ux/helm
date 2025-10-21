"use client"

import * as React from "react"
import { Check, ChevronsUpDown, FolderKanban } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export interface ProjectSwitcherProject {
  id: string
  name: string
  description?: string | null
}

export function ProjectSwitcher({
  projects = [],
  selectedProjectId,
  onProjectSelect,
  onCreateProject,
  onViewAllProjects,
}: {
  projects?: ProjectSwitcherProject[]
  selectedProjectId?: string | null
  onProjectSelect?: (projectId: string | null) => void
  onCreateProject?: () => void
  onViewAllProjects?: () => void
}) {
  const selected = projects.find((p) => p.id === selectedProjectId) || null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-purple-600 text-white">
                {selected ? (
                  <span className="text-sm font-semibold">
                    {selected.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FolderKanban className="size-4" />
                )}
              </div>
              <div className="flex min-w-0 flex-col leading-none">
                <span className="font-semibold truncate">{selected?.name || "Select a project"}</span>
                {selected?.description && (
                  <span className="text-xs text-muted-foreground truncate">{selected.description}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] z-50 bg-white border border-gray-200"
            align="start"
            sideOffset={4}
          >
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onSelect={() => onProjectSelect?.(project.id)}
                className="whitespace-normal leading-snug"
              >
                <span>{project.name}</span>
                {project.id === selectedProjectId && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onSelect={() => onViewAllProjects?.()} className="whitespace-normal leading-snug">
              View all projects
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onCreateProject?.()} className="whitespace-normal leading-snug">
              Create new project
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onProjectSelect?.(null)} className="whitespace-normal leading-snug">
              Clear selection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}


