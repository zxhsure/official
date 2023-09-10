<div style="overflow:hidden;"><img src="../assets/me.jpeg" alt="风起" style="border-radius:50%;width: 25px;float:left;"> <div style="float:left;margin-top: 2px;margin-left: 3px;font-size: 12px;">风起</div></div>
<div style="clear:both;font-size: 12px;height:50px;line-height: 34px;">2023-09-11</div>

# wasm与wgpu（三）：管线
## 管线（Pipeline）

你可以把**管线** (Pipeline) 看成是更强大版本的着色器。一个管线描述了 GPU 将对一组数据执行的所有操作。

上节内容介绍了展示平面，并绘制了画布的填充色。这节内容介绍管线，并利用管线绘制三角形。

示例工程代码见[【wgpu003】](https://github.com/zxhsure/learn/tree/main/wgpu003)

<img src="../assets/wgpu003-1.png" alt="image-20230911070606274" style="zoom: 50%;" />

## 着色器（Shader）

**着色器**（Shader）是你发送给 GPU 的微型程序，用于对数据进行操作。

有三种主要类型的着色器：**顶点**（Vertex）、**片元**（Fragment）和**计算**（Compute）着色器。另外还有其他的如几何着色器，但它们属于进阶话题。现在，我们只需要使用顶点和片元着色器。

- **顶点**（Vertex）就是三维（或二维）空间中的一个点。这些顶点会两个一组以构成线段集合，或者三个一组以构成三角形集合。大多数现代渲染系统都使用三角形来建模所有图形，这些三角形被存储为构成三角形角的顶点。我们使用顶点着色器来操作顶点，以便按我们想要的样子做图形的变换。

- 顶点经过**光栅化**（rasterization）后流转到**片元着色**阶段，片元着色器决定了片元的颜色。渲染结果图像中的每个像素至少对应一个片元，每个片元可输出一个颜色，该颜色会被存储到其相应的像素上（准确的说，片元的输出是存储到 Color Attachment 的**纹素**上）。

## 着色器语言（WGSL）

**WGSL** (WebGPU Shading Language) 是 WebGPU 的着色器语言。 WGSL 的开发重点是让它轻松转换为与后端对应的着色器语言；例如，Vulkan 的 SPIR-V、Metal 的 MSL、DX12 的 HLSL 和 OpenGL 的 GLSL。 这种转换是在内部完成的，我们不需要关心这些细节。 就 wgpu 而言，它是由名为 [naga](https://github.com/gfx-rs/naga) 的**包**完成的。

```wgsl
// Vertex shader

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
};

@vertex
fn vs_main(
    @builtin(vertex_index) in_vertex_index: u32,
) -> VertexOutput {
    var out: VertexOutput;
    let x = f32(1 - i32(in_vertex_index)) * 0.5;
    let y = f32(i32(in_vertex_index & 1u) * 2 - 1) * 0.5;
    out.clip_position = vec4<f32>(x, y, 0.0, 1.0);
    return out;
}

// Fragment shader

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return vec4<f32>(0.3, 0.2, 0.1, 1.0);
}
```

## 使用着色器

创建渲染管线`render_pipeline`需要的资源有`shader`和`pipelineLayout`

创建好渲染管线`render_pipeline`后，需要在渲染管道`render_pass`上设置渲染管线`render_pipeline`

- 载入着色器`shader`

```rust
let shader = device.create_shader_module(wgpu::ShaderModuleDescriptor {
            label: Some("Shader"),
            source: wgpu::ShaderSource::Wgsl(include_str!("shader.wgsl").into()),
        });
```

- 创建`pipelineLayout`

```rust
let render_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("Render Pipeline Layout"),
                bind_group_layouts: &[],
                push_constant_ranges: &[],
            });
```

- 创建渲染管线`render_pipeline`

```rust
let render_pipeline = device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("Render Pipeline"),
            layout: Some(&render_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &shader,
                entry_point: "vs_main",
                buffers: &[],
            },
            fragment: Some(wgpu::FragmentState {
                module: &shader,
                entry_point: "fs_main",
                targets: &[Some(wgpu::ColorTargetState {
                    format: config.format,
                    blend: Some(wgpu::BlendState {
                        color: wgpu::BlendComponent::REPLACE,
                        alpha: wgpu::BlendComponent::REPLACE,
                    }),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleList,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: Some(wgpu::Face::Back),
                // Setting this to anything other than Fill requires Features::POLYGON_MODE_LINE
                // or Features::POLYGON_MODE_POINT
                polygon_mode: wgpu::PolygonMode::Fill,
                // Requires Features::DEPTH_CLIP_CONTROL
                unclipped_depth: false,
                // Requires Features::CONSERVATIVE_RASTERIZATION
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            // If the pipeline will be used with a multiview render pass, this
            // indicates how many array layers the attachments will have.
            multiview: None,
});
```

- 在渲染管道上设置渲染管线

```rust
render_pass.set_pipeline(&self.render_pipeline);
render_pass.draw(0..3, 0..1);
```

