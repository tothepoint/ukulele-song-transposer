"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Plus, Minus, Music } from "lucide-react"

// Comprehensive ukulele chord library with ALL sharp/flat variations
const UKULELE_CHORDS = {
  // Basic major chords
  A: { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  B: { frets: [4, 3, 2, 2], fingers: [4, 3, 1, 2] },
  Bb: { frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1] },
  C: { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  D: { frets: [2, 2, 2, 0], fingers: [1, 1, 2, 0] },
  E: { frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1] },
  F: { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  G: { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  "C#": { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4] },
  "D#": { frets: [0, 3, 3, 1], fingers: [0, 2, 3, 1] },
  "F#": { frets: [3, 1, 2, 1], fingers: [4, 1, 3, 2] },
  "G#": { frets: [5, 3, 4, 3], fingers: [4, 1, 3, 2] },
  "A#": { frets: [3, 2, 1, 1], fingers: [4, 3, 1, 2] },
  Db: { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4] },
  Eb: { frets: [0, 3, 3, 1], fingers: [0, 2, 3, 1] },
  Gb: { frets: [3, 1, 2, 1], fingers: [4, 1, 3, 2] },
  Ab: { frets: [5, 3, 4, 3], fingers: [4, 1, 3, 2] },

  // Minor chords
  Am: { frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0] },
  Bm: { frets: [4, 2, 2, 2], fingers: [4, 1, 2, 3] },
  Bbm: { frets: [3, 1, 1, 1], fingers: [4, 1, 2, 3] },
  Cm: { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  Dm: { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  Em: { frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  Fm: { frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4] },
  Gm: { frets: [0, 2, 3, 1], fingers: [0, 2, 4, 1] },
  "C#m": { frets: [1, 1, 0, 4], fingers: [1, 2, 0, 4] },
  "D#m": { frets: [3, 3, 2, 1], fingers: [3, 4, 2, 1] },
  "F#m": { frets: [2, 1, 2, 0], fingers: [3, 1, 4, 0] },
  "G#m": { frets: [1, 3, 4, 2], fingers: [1, 3, 4, 2] },
  "A#m": { frets: [3, 1, 1, 1], fingers: [4, 1, 2, 3] },
  Dbm: { frets: [1, 1, 0, 4], fingers: [1, 2, 0, 4] },
  Ebm: { frets: [3, 3, 2, 1], fingers: [3, 4, 2, 1] },
  Gbm: { frets: [2, 1, 2, 0], fingers: [3, 1, 4, 0] },
  Abm: { frets: [1, 3, 4, 2], fingers: [1, 3, 4, 2] },

  // 7th chords
  A7: { frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0] },
  B7: { frets: [2, 3, 2, 2], fingers: [1, 4, 2, 3] },
  Bb7: { frets: [1, 2, 1, 1], fingers: [1, 3, 2, 1] },
  C7: { frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] },
  D7: { frets: [2, 2, 2, 3], fingers: [1, 1, 2, 4] },
  E7: { frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },
  F7: { frets: [2, 3, 1, 3], fingers: [2, 4, 1, 3] },
  G7: { frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },
  "C#7": { frets: [1, 1, 1, 2], fingers: [1, 1, 1, 3] },
  "D#7": { frets: [3, 3, 3, 4], fingers: [1, 1, 2, 4] },
  "F#7": { frets: [3, 4, 2, 4], fingers: [2, 4, 1, 3] },
  "G#7": { frets: [1, 3, 2, 3], fingers: [1, 4, 2, 3] },
  "A#7": { frets: [1, 2, 1, 1], fingers: [1, 3, 2, 1] },
  Db7: { frets: [1, 1, 1, 2], fingers: [1, 1, 1, 3] },
  Eb7: { frets: [3, 3, 3, 4], fingers: [1, 1, 2, 4] },
  Gb7: { frets: [3, 4, 2, 4], fingers: [2, 4, 1, 3] },
  Ab7: { frets: [1, 3, 2, 3], fingers: [1, 4, 2, 3] },

  // Minor 7th chords
  Am7: { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  Bm7: { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1] },
  Bbm7: { frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1] },
  Cm7: { frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1] },
  Dm7: { frets: [2, 2, 1, 3], fingers: [2, 3, 1, 4] },
  Em7: { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  Fm7: { frets: [1, 3, 1, 3], fingers: [1, 3, 2, 4] },
  Gm7: { frets: [0, 2, 1, 1], fingers: [0, 3, 1, 2] },
  "C#m7": { frets: [1, 1, 0, 2], fingers: [1, 2, 0, 4] },
  "D#m7": { frets: [3, 3, 2, 4], fingers: [2, 3, 1, 4] },
  "F#m7": { frets: [2, 4, 2, 4], fingers: [1, 3, 2, 4] },
  "G#m7": { frets: [1, 3, 1, 3], fingers: [1, 4, 2, 3] },
  "A#m7": { frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1] },
  Dbm7: { frets: [1, 1, 0, 2], fingers: [1, 2, 0, 4] },
  Ebm7: { frets: [3, 3, 2, 4], fingers: [2, 3, 1, 4] },
  Gbm7: { frets: [2, 4, 2, 4], fingers: [1, 3, 2, 4] },
  Abm7: { frets: [1, 3, 1, 3], fingers: [1, 4, 2, 3] },

  // Major 7th chords
  Amaj7: { frets: [1, 1, 0, 0], fingers: [1, 1, 0, 0] },
  Bmaj7: { frets: [3, 3, 2, 2], fingers: [3, 4, 1, 2] },
  Bbmaj7: { frets: [2, 2, 1, 1], fingers: [3, 4, 1, 2] },
  Cmaj7: { frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2] },
  Dmaj7: { frets: [2, 2, 2, 4], fingers: [1, 1, 2, 4] },
  Emaj7: { frets: [1, 3, 0, 2], fingers: [1, 4, 0, 3] },
  Fmaj7: { frets: [2, 4, 1, 3], fingers: [2, 4, 1, 3] },
  Gmaj7: { frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  "C#maj7": { frets: [1, 1, 1, 3], fingers: [1, 1, 2, 4] },
  "D#maj7": { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  "F#maj7": { frets: [3, 5, 2, 4], fingers: [2, 4, 1, 3] },
  "G#maj7": { frets: [1, 3, 3, 3], fingers: [1, 2, 3, 4] },
  "A#maj7": { frets: [2, 2, 1, 1], fingers: [3, 4, 1, 2] },
  Dbmaj7: { frets: [1, 1, 1, 3], fingers: [1, 1, 2, 4] },
  Ebmaj7: { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  Gbmaj7: { frets: [3, 5, 2, 4], fingers: [2, 4, 1, 3] },
  Abmaj7: { frets: [1, 3, 3, 3], fingers: [1, 2, 3, 4] },

  // 6th chords
  A6: { frets: [2, 4, 2, 4], fingers: [1, 3, 2, 4] },
  B6: { frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1] },
  Bb6: { frets: [0, 2, 1, 1], fingers: [0, 3, 1, 2] },
  C6: { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  D6: { frets: [2, 4, 2, 2], fingers: [1, 4, 2, 3] },
  E6: { frets: [4, 4, 4, 4], fingers: [1, 1, 1, 1] },
  F6: { frets: [2, 2, 1, 3], fingers: [2, 3, 1, 4] },
  G6: { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "C#6": { frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1] },
  "D#6": { frets: [0, 3, 2, 2], fingers: [0, 4, 1, 2] },
  "F#6": { frets: [3, 3, 2, 4], fingers: [2, 3, 1, 4] },
  "G#6": { frets: [1, 3, 1, 3], fingers: [1, 3, 2, 4] },
  "A#6": { frets: [0, 2, 1, 1], fingers: [0, 3, 1, 2] },
  Db6: { frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1] },
  Eb6: { frets: [0, 3, 2, 2], fingers: [0, 4, 1, 2] },
  Gb6: { frets: [3, 3, 2, 4], fingers: [2, 3, 1, 4] },
  Ab6: { frets: [1, 3, 1, 3], fingers: [1, 3, 2, 4] },

  // Minor 6th chords
  Am6: { frets: [2, 4, 2, 4], fingers: [1, 3, 2, 4] },
  Bm6: { frets: [1, 2, 1, 1], fingers: [1, 3, 2, 1] },
  Bbm6: { frets: [0, 1, 1, 1], fingers: [0, 1, 2, 3] },
  Cm6: { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  Dm6: { frets: [2, 2, 1, 2], fingers: [2, 3, 1, 4] },
  Em6: { frets: [4, 1, 0, 2], fingers: [4, 1, 0, 3] },
  Fm6: { frets: [1, 2, 1, 3], fingers: [1, 2, 1, 4] },
  Gm6: { frets: [0, 2, 0, 1], fingers: [0, 2, 0, 1] },
  "C#m6": { frets: [1, 1, 0, 1], fingers: [2, 3, 0, 1] },
  "D#m6": { frets: [3, 3, 2, 3], fingers: [2, 3, 1, 4] },
  "F#m6": { frets: [2, 3, 2, 4], fingers: [1, 2, 1, 4] },
  "G#m6": { frets: [1, 3, 1, 2], fingers: [1, 4, 2, 3] },
  "A#m6": { frets: [0, 1, 1, 1], fingers: [0, 1, 2, 3] },
  Dbm6: { frets: [1, 1, 0, 1], fingers: [2, 3, 0, 1] },
  Ebm6: { frets: [3, 3, 2, 3], fingers: [2, 3, 1, 4] },
  Gbm6: { frets: [2, 3, 2, 4], fingers: [1, 2, 1, 4] },
  Abm6: { frets: [1, 3, 1, 2], fingers: [1, 4, 2, 3] },

  // Sus2 chords
  Asus2: { frets: [2, 4, 5, 2], fingers: [1, 2, 4, 1] },
  Bsus2: { frets: [2, 2, 0, 2], fingers: [1, 2, 0, 3] },
  Bbsus2: { frets: [1, 1, 3, 1], fingers: [1, 1, 4, 1] },
  Csus2: { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  Dsus2: { frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  Esus2: { frets: [4, 4, 2, 2], fingers: [3, 4, 1, 2] },
  Fsus2: { frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3] },
  Gsus2: { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "C#sus2": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "D#sus2": { frets: [3, 3, 1, 1], fingers: [3, 4, 1, 2] },
  "F#sus2": { frets: [1, 1, 2, 4], fingers: [1, 1, 2, 4] },
  "G#sus2": { frets: [1, 3, 4, 1], fingers: [1, 3, 4, 2] },
  "A#sus2": { frets: [1, 1, 3, 1], fingers: [1, 1, 4, 1] },
  Dbsus2: { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  Ebsus2: { frets: [3, 3, 1, 1], fingers: [3, 4, 1, 2] },
  Gbsus2: { frets: [1, 1, 2, 4], fingers: [1, 1, 2, 4] },
  Absus2: { frets: [1, 3, 4, 1], fingers: [1, 3, 4, 2] },

  // Sus4 chords
  Asus4: { frets: [2, 2, 0, 0], fingers: [2, 3, 0, 0] },
  Bsus4: { frets: [4, 4, 0, 2], fingers: [3, 4, 0, 1] },
  Bbsus4: { frets: [3, 3, 4, 1], fingers: [2, 3, 4, 1] },
  Csus4: { frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3] },
  Dsus4: { frets: [0, 2, 3, 0], fingers: [0, 1, 3, 0] },
  Esus4: { frets: [2, 4, 0, 2], fingers: [2, 4, 0, 3] },
  Fsus4: { frets: [3, 0, 1, 3], fingers: [3, 0, 1, 4] },
  Gsus4: { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "C#sus4": { frets: [1, 1, 2, 4], fingers: [1, 1, 2, 4] },
  "D#sus4": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "F#sus4": { frets: [4, 1, 2, 4], fingers: [3, 1, 2, 4] },
  "G#sus4": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "A#sus4": { frets: [3, 3, 4, 1], fingers: [2, 3, 4, 1] },
  Dbsus4: { frets: [1, 1, 2, 4], fingers: [1, 1, 2, 4] },
  Ebsus4: { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  Gbsus4: { frets: [4, 1, 2, 4], fingers: [3, 1, 2, 4] },
  Absus4: { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },

  // 7sus4 chords
  A7sus4: { frets: [0, 2, 0, 0], fingers: [0, 2, 0, 0] },
  B7sus4: { frets: [2, 4, 0, 2], fingers: [2, 4, 0, 3] },
  Bb7sus4: { frets: [1, 3, 1, 1], fingers: [1, 4, 2, 3] },
  C7sus4: { frets: [0, 0, 1, 1], fingers: [0, 0, 1, 2] },
  D7sus4: { frets: [0, 2, 1, 3], fingers: [0, 2, 1, 4] },
  E7sus4: { frets: [2, 2, 0, 2], fingers: [2, 3, 0, 4] },
  F7sus4: { frets: [3, 3, 1, 3], fingers: [2, 3, 1, 4] },
  G7sus4: { frets: [0, 2, 1, 3], fingers: [0, 2, 1, 4] },
  "C#7sus4": { frets: [1, 1, 2, 2], fingers: [1, 1, 3, 4] },
  "D#7sus4": { frets: [1, 3, 2, 4], fingers: [1, 3, 2, 4] },
  "F#7sus4": { frets: [4, 4, 2, 4], fingers: [2, 3, 1, 4] },
  "G#7sus4": { frets: [1, 3, 2, 4], fingers: [1, 4, 2, 3] },
  "A#7sus4": { frets: [1, 3, 1, 1], fingers: [1, 4, 2, 3] },
  Db7sus4: { frets: [1, 1, 2, 2], fingers: [1, 1, 3, 4] },
  Eb7sus4: { frets: [1, 3, 2, 4], fingers: [1, 3, 2, 4] },
  Gb7sus4: { frets: [4, 4, 2, 4], fingers: [2, 3, 1, 4] },
  Ab7sus4: { frets: [1, 3, 2, 4], fingers: [1, 4, 2, 3] },

  // 9th chords
  A9: { frets: [0, 1, 0, 2], fingers: [0, 1, 0, 3] },
  B9: { frets: [2, 1, 2, 2], fingers: [3, 1, 4, 2] },
  C9: { frets: [0, 2, 0, 1], fingers: [0, 3, 0, 1] },
  D9: { frets: [2, 4, 2, 3], fingers: [1, 4, 2, 3] },
  E9: { frets: [1, 2, 2, 2], fingers: [1, 2, 3, 4] },
  F9: { frets: [2, 3, 3, 3], fingers: [1, 2, 3, 4] },
  G9: { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "C#9": { frets: [1, 3, 1, 2], fingers: [1, 4, 2, 3] },
  "D#9": { frets: [3, 5, 3, 4], fingers: [1, 4, 2, 3] },
  "F#9": { frets: [3, 4, 4, 4], fingers: [1, 2, 3, 4] },
  "G#9": { frets: [1, 3, 1, 3], fingers: [1, 3, 2, 4] },
  "A#9": { frets: [2, 1, 2, 2], fingers: [3, 1, 4, 2] },
  Db9: { frets: [1, 3, 1, 2], fingers: [1, 4, 2, 3] },
  Eb9: { frets: [3, 5, 3, 4], fingers: [1, 4, 2, 3] },
  Gb9: { frets: [3, 4, 4, 4], fingers: [1, 2, 3, 4] },
  Ab9: { frets: [1, 3, 1, 3], fingers: [1, 3, 2, 4] },

  // Diminished chords
  Adim: { frets: [2, 3, 2, 3], fingers: [1, 3, 2, 4] },
  Bdim: { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  Bbdim: { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  Cdim: { frets: [2, 3, 2, 3], fingers: [1, 4, 2, 3] },
  Ddim: { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  Edim: { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  Fdim: { frets: [2, 0, 2, 0], fingers: [2, 0, 3, 0] },
  Gdim: { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "C#dim": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "D#dim": { frets: [2, 3, 2, 3], fingers: [1, 4, 2, 3] },
  "F#dim": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "G#dim": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "A#dim": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  Dbdim: { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  Ebdim: { frets: [2, 3, 2, 3], fingers: [1, 4, 2, 3] },
  Gbdim: { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  Abdim: { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },

  // Augmented chords
  Aaug: { frets: [2, 1, 1, 0], fingers: [3, 1, 2, 0] },
  Baug: { frets: [0, 3, 3, 2], fingers: [0, 2, 3, 1] },
  Bbaug: { frets: [3, 2, 2, 1], fingers: [4, 2, 3, 1] },
  Caug: { frets: [1, 0, 0, 3], fingers: [1, 0, 0, 4] },
  Daug: { frets: [3, 2, 2, 1], fingers: [4, 2, 3, 1] },
  Eaug: { frets: [1, 0, 0, 3], fingers: [1, 0, 0, 4] },
  Faug: { frets: [2, 1, 1, 0], fingers: [3, 1, 2, 0] },
  Gaug: { frets: [0, 3, 3, 2], fingers: [0, 2, 3, 1] },
  "C#aug": { frets: [2, 1, 1, 0], fingers: [4, 1, 2, 0] },
  "D#aug": { frets: [0, 3, 3, 2], fingers: [0, 3, 4, 1] },
  "F#aug": { frets: [3, 2, 2, 1], fingers: [4, 2, 3, 1] },
  "G#aug": { frets: [1, 0, 0, 3], fingers: [1, 0, 0, 4] },
  "A#aug": { frets: [3, 2, 2, 1], fingers: [4, 2, 3, 1] },
  Dbaug: { frets: [2, 1, 1, 0], fingers: [4, 1, 2, 0] },
  Ebaug: { frets: [0, 3, 3, 2], fingers: [0, 3, 4, 1] },
  Gbaug: { frets: [3, 2, 2, 1], fingers: [4, 2, 3, 1] },
  Abaug: { frets: [1, 0, 0, 3], fingers: [1, 0, 0, 4] },
}

const isValidChord = (chord: string): boolean => {
  // Enhanced chord pattern matching to support complex chords
  const chordPattern = /^[A-G][#b]?(m|maj|min|dim|aug|sus[24]?|add\d+|\d+|7sus4|6|m6|9|11|13)*$/
  return chordPattern.test(chord) && chord.length <= 10
}

const CHROMATIC_SHARP = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
const CHROMATIC_FLAT = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"]

interface ChordDiagramProps {
  chord: string
  frets: number[]
  fingers: number[]
}

function ChordDiagram({ chord, frets, fingers }: ChordDiagramProps) {
  return (
    <div className="flex flex-col items-center p-2">
      <div className="font-semibold text-sm mb-2">{chord}</div>
      <svg width="50" height="70" viewBox="0 0 50 70" className="border rounded">
        {/* Strings (vertical lines) */}
        {[0, 1, 2, 3].map((string) => (
          <line
            key={`string-${string}`}
            x1={10 + string * 10}
            y1={10}
            x2={10 + string * 10}
            y2={60}
            stroke="#333"
            strokeWidth="1"
          />
        ))}

        {/* Frets (horizontal lines) */}
        {[0, 1, 2, 3, 4].map((fret) => (
          <line
            key={`fret-${fret}`}
            x1={10}
            y1={10 + fret * 10}
            x2={40}
            y2={10 + fret * 10}
            stroke="#333"
            strokeWidth={fret === 0 ? "2" : "1"}
          />
        ))}

        {/* Finger positions */}
        {frets.map((fret, string) => {
          if (fret === 0) {
            // Open string
            return (
              <circle
                key={`open-${string}`}
                cx={10 + string * 10}
                cy={5}
                r="3"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />
            )
          } else if (fret <= 4) {
            // Fretted note
            return (
              <circle key={`fret-${string}`} cx={10 + string * 10} cy={10 + (fret - 0.5) * 10} r="4" fill="#3b82f6" />
            )
          }
          return null
        })}
      </svg>
    </div>
  )
}

export default function UkuleleTransposer() {
  const [songText, setSongText] = useState("")
  const [transposition, setTransposition] = useState(0)
  const [transposedText, setTransposedText] = useState("")
  const [uniqueChords, setUniqueChords] = useState<string[]>([])
  const [copySuccess, setCopySuccess] = useState(false)

  const parseChords = useCallback((text: string): string[] => {
    const chords = new Set<string>()

    // Find chords in square brackets [chord]
    const bracketMatches = text.match(/\[([^\]]+)\]/g)
    if (bracketMatches) {
      bracketMatches.forEach((match) => {
        const chord = match.slice(1, -1).trim()
        if (isValidChord(chord)) {
          chords.add(chord)
        }
      })
    }

    // Find chords on their own lines
    const lines = text.split("\n")
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && isChordLine(trimmedLine)) {
        const lineChords = trimmedLine.split(/\s+/)
        lineChords.forEach((chord) => {
          if (isValidChord(chord)) {
            chords.add(chord)
          }
        })
      }
    })

    return Array.from(chords)
  }, [])

  const isChordLine = (line: string): boolean => {
    const words = line.split(/\s+/).filter((w) => w.length > 0)
    if (words.length === 0) return false

    const chordCount = words.filter((word) => isValidChord(word)).length
    return chordCount / words.length > 0.6
  }

  const transposeChord = useCallback(
    (chord: string): string => {
      if (!chord || !isValidChord(chord)) return chord

      // Extract root note and suffix
      const match = chord.match(/^([A-G][#b]?)(.*)$/)
      if (!match) return chord

      const [, root, suffix] = match
      const useFlats = root.includes("b")
      const scale = useFlats ? CHROMATIC_FLAT : CHROMATIC_SHARP

      // Find current position
      let currentIndex = scale.indexOf(root)
      if (currentIndex === -1) {
        // Try the other scale
        const altScale = useFlats ? CHROMATIC_SHARP : CHROMATIC_FLAT
        currentIndex = altScale.indexOf(root)
        if (currentIndex === -1) return chord
      }

      // Calculate new position
      let newIndex = (currentIndex + transposition) % 12
      if (newIndex < 0) newIndex += 12

      const newRoot = scale[newIndex]
      return newRoot + suffix
    },
    [transposition],
  )

  const transposeText = useCallback(
    (text: string): string => {
      let result = text

      // Transpose chords in square brackets
      result = result.replace(/\[([^\]]+)\]/g, (match, chord) => {
        const transposedChord = transposeChord(chord.trim())
        return `[${transposedChord}]`
      })

      // Transpose chords on their own lines
      const lines = result.split("\n")
      const processedLines = lines.map((line) => {
        const trimmedLine = line.trim()
        if (trimmedLine && isChordLine(trimmedLine)) {
          const words = line.split(/(\s+)/) // Preserve spacing
          return words
            .map((word) => {
              if (word.trim() && isValidChord(word.trim())) {
                return transposeChord(word.trim())
              }
              return word
            })
            .join("")
        }
        return line
      })

      return processedLines.join("\n")
    },
    [transposeChord],
  )

  const updateTransposition = (delta: number) => {
    setTransposition((prev) => prev + delta)
  }

  const getTranspositionDisplay = () => {
    if (transposition === 0) return "0"
    const abs = Math.abs(transposition)
    const sign = transposition > 0 ? "+" : ""
    const unit = abs === 1 ? "semitone" : "semitones"
    return `${sign}${transposition} ${unit}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transposedText)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  useEffect(() => {
    const originalChords = parseChords(songText)
    const newTransposedText = transposeText(songText)
    const newUniqueChords = parseChords(newTransposedText)

    setTransposedText(newTransposedText)
    setUniqueChords(newUniqueChords)
  }, [songText, transposition, parseChords, transposeText])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Ukulele Song Transposer</h1>
          </div>
          <p className="text-lg text-gray-600">Transpose your favorite songs to any key with chord charts</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📝</span> Song Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={`Paste your song here. Place chords on their own line or inside square brackets, like [Am].

Example:
[G] Somewhere over the [C] rainbow
Way up [G] high
[C] There's a [G] land that I [Em] heard of
[Am] Once in a lulla[D]by`}
                value={songText}
                onChange={(e) => setSongText(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />

              {/* Transpose Controls */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold">Transpose:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateTransposition(-1)}
                  className="w-10 h-10 rounded-full p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-mono">
                  {getTranspositionDisplay()}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateTransposition(1)}
                  className="w-10 h-10 rounded-full p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎸</span> Transposed Song
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chord Charts */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Chord Charts</h3>
                {uniqueChords.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {uniqueChords.map((chord) => {
                      const chordData = UKULELE_CHORDS[chord]
                      return chordData ? (
                        <ChordDiagram key={chord} chord={chord} frets={chordData.frets} fingers={chordData.fingers} />
                      ) : (
                        <div key={chord} className="flex flex-col items-center p-2">
                          <div className="font-semibold text-sm mb-2">{chord}</div>
                          <div className="text-xs text-gray-500 text-center">
                            Chart not
                            <br />
                            available
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Chord charts will appear here when you enter a song</p>
                )}
              </div>

              {/* Transposed Text */}
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm min-h-[250px]">
                  {transposedText || "Transposed song will appear here..."}
                </pre>
              </div>

              {/* Copy Button */}
              <Button onClick={copyToClipboard} className="w-full" disabled={!transposedText}>
                <Copy className="h-4 w-4 mr-2" />
                {copySuccess ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
