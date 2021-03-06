import React from "react"

import LogoutButton from "./LogoutButton"
import Flex from "./Flex"
import vars from "../styles/vars"

function LogoutButtonFloating() {
  return (
    <Flex justifyContent="center">
      <LogoutButton background={vars.darkBlue} color={vars.orange} />
    </Flex>
  )
}

export default LogoutButtonFloating
