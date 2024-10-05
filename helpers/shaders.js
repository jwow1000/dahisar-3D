export const grayscaleShader = {
  uniforms: {
    u_texture: { value: null }, // Texture to be assigned per element
    u_grayScale: { value: 1.0 } // 1.0 for grayscale, 0.0 for full color
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D u_texture;
    uniform float u_grayScale;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(u_texture, vUv);
      // Calculate grayscale using luminance formula
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      // Mix grayscale and color based on u_grayScale uniform
      vec3 finalColor = mix(vec3(gray), color.rgb, u_grayScale);
      gl_FragColor = vec4(finalColor, color.a); // Preserve alpha channel for transparency
    }
  `,
  transparent: true, // Allow for transparency
};