import './style.scss'
import { Text } from '@gravity-ui/uikit'
import block from 'bem-cn-lite'
import { fetchProjectById } from '@/app/actions/Projects'
import { Project } from '@/data/projects/project'
import EditProjectForm from '@/app/projects/edit/[id]/EditForm'

const b = block('project-edit')

export default async function ProjctEdit({
  params,
}: {
  params: { id: string }
}) {
  const project: Project = await fetchProjectById(params.id)
  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Редактировать проект: {project.name}</Text>
      </h1>
      <EditProjectForm oldProject={project} />
    </div>
  )
}
