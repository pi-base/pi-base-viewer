import React from 'react'
import Relay from 'react-relay'
import {Route} from 'react-router'

import App    from '../components/App'
import Space  from '../components/Space'
import Spaces from '../components/Spaces'
import Search from '../components/Search'
import Trait  from '../components/Trait'

const SpaceQueries = {
  space: () => Relay.QL`query { space(id: $spaceId) }`
}
const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}

const Spinner = () => <p>Loading ...</p>

const Loading = () => (
  <App viewer={null}>
    <Spinner/>
  </App>
)

const routes = (
  <Route
    path="/"
    component={App}
    queries={ViewerQueries}
    render={({props}) => props ? <App {...props}/> : <Loading/>}
  >
    <Route path="spaces" component={Spaces} queries={ViewerQueries}/>
    <Route path="spaces/:spaceId" component={Space} queries={SpaceQueries}>
      <Route path="properties/:propertyId" component={Trait} queries={SpaceQueries}/>
    </Route>
    <Route path="search" component={Search} queries={ViewerQueries}/>
  </Route>
)

export default routes
