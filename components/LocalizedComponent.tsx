import { Builder } from "@builder.io/react";
import React from 'react';

export const LocalizedComponent = (props: { title: string; }) => {
  return(
      <p>{props.title}</p>
  )
}

Builder.registerComponent(LocalizedComponent, {
  name: "Localized Text",
  inputs: [
    {
      name: "title",
      type: "text", 
      defaultValue: 'I am localized text!',
      localized: true,
    },
  ],
});
