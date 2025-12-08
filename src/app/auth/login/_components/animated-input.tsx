"use client"

import type React from "react"
import { useState } from "react"

interface AnimatedInputProps {
  id: string
  name: string
  type: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export default function AnimatedInput({ id, name, type, label, value, onChange, onBlur }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const isLabelFloated = isFocused || value.length > 0

  const labelLetters = label.split("").map((letter, index) => (
    <span
      key={index}
      style={{
        display: "inline-block",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: isLabelFloated ? `${index * 0.05}s` : "0s",
        transform: isLabelFloated ? "translateY(-20px) scale(0.85)" : "translateY(0) scale(1)",
        opacity: isFocused ? 1 : 1,
      }}
    >
      {letter === " " ? "\u00A0" : letter}
    </span>
  ))

  return (
    <div className="relative pt-6">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false)
          onBlur?.(e)
        }}
        onFocus={() => setIsFocused(true)}
        className="peer w-full bg-transparent px-0 py-2 text-foreground outline-none border-b-2 border-border transition-colors duration-300 hover:border-primary/50 focus:border-primary placeholder-transparent"
        placeholder={label}
      />
      <label htmlFor={id} className="absolute left-0 top-6 text-muted-foreground text-sm font-medium">
        {labelLetters}
      </label>
    </div>
  )
}

