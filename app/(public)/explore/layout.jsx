import { ExploreLayoutClient } from './_components/explore-layout-client'

export default function ExploreLayout({ children }) {
  return (
    <ExploreLayoutClient>
      {children}
    </ExploreLayoutClient>
  )
}
