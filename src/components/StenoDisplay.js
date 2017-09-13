//@flow
import React from 'react'
import Stroke from './Stroke'

type Props =
  { chord: string
  , labels?: 'all' | string // STKPW...
  }

const ALL_LETTERS = new Stroke('#STKPWHRAO*EUFRPBLGTSDZ')

const StenoDisplay =
  ({ chord, labels }: Props) => {
    const userChord = new Stroke(chord)
    const lettering =
      !labels
        ? null
        : labels.toLowerCase() === 'all'
        ? ALL_LETTERS
        : new Stroke(labels)

    return <div style={{textAlign: 'center'}}>
      <Stroke.Layout chord={userChord} lettering={lettering}/>
    </div>
  }

export default StenoDisplay
