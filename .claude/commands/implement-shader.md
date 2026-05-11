Implement the currently selected Paper shader in the target app.

1. Use `mcp__paper__get_selection` to identify the selected shader node.
2. Use `mcp__paper__get_jsx` with `format: "inline-styles"` on that node to extract the exact component name, parameters, and color values. The output will look like:
   ```
   import { GrainGradient } from '@paper-design/shaders-react';
   <GrainGradient speed={...} scale={...} colors={[...]} ... />
   ```
3. Implement the shader with `ShaderMount` from `@paper-design/shaders` rather than the React wrapper from the JSX output. The package is vanilla JS and does not depend on a framework.
4. Import the matching fragment shader export and shape enum for the selected shader, for example `grainGradientFragmentShader` and `GrainGradientShapes`.
5. Map the Paper JSX props to `ShaderMount` uniforms in `onMounted` or the equivalent framework lifecycle hook.
6. Make the container element fill the target space; `ShaderMount` manages the canvas inside it.
7. Ask the user where they want the shader implemented if they have not already said.
