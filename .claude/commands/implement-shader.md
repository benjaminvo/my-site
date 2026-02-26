Implement the currently selected Paper shader as a Vue component.

1. Use `mcp__paper__get_selection` to identify the selected shader node.
2. Use `mcp__paper__get_jsx` with `format: "inline-styles"` on that node to extract the exact component name, parameters, and color values. The output will look like:
   ```
   import { GrainGradient } from '@paper-design/shaders-react';
   <GrainGradient speed={...} scale={...} colors={[...]} ... />
   ```
3. Map those props to `ShaderMount` uniforms (see CLAUDE.md for the pattern).
4. Ask the user where they want the shader implemented if they haven't already said.
5. Implement it there using `ShaderMount` from `@paper-design/shaders`.
