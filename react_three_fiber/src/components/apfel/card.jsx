import {Container, DefaultProperties} from '@react-three/uikit'
import React, {forwardRef} from 'react'
import {colors, GlassMaterial} from './theme.jsx'

export const Card = forwardRef(
  ({children, ...props}, ref) => {
    return (
      <Container
        backgroundColor={colors.card}
        backgroundOpacity={0.8}
        borderColor={colors.card}
        borderOpacity={0}
        borderWidth={4}
        borderBend={0.3}
        panelMaterialClass={GlassMaterial}
        borderRadius={32}
        ref={ref}
        {...props}
      >
        <DefaultProperties color={colors.cardForeground}>{children}</DefaultProperties>
      </Container>
    )
  },
)
