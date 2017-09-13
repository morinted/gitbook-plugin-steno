//@flow
import React from 'react'
import { renderToStaticMarkup as r } from 'react-dom/server'

import StenoDisplay from './components/StenoDisplay'

type StenoDisplayParams =
  { kwargs: { labels?: 'all' | string }
  , body: string // The chord to be displayed
  }

module.exports =
  { blocks:
    { stenodisplay:
      { process:
        ({ kwargs, body }: StenoDisplayParams) =>
          r(
            <StenoDisplay
              chord={body}
              labels={kwargs.labels}
            />
          )
      }
    }
  }
