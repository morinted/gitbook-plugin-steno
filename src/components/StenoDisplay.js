//@flow
import React from 'react'
import Stroke from './Stroke'

type Props =
  { chord: string
  , size: 'sm'|'md'|'lg'
  }

const StenoDisplay =
  ({ chord, size }: Props) => {
    return (new Stroke(chord)).SVG
  }

export default StenoDisplay
