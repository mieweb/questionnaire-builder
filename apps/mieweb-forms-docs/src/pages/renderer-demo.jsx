import React from 'react';
import Layout from '@theme/Layout';
import RendererDemo from '../components/RendererDemo';

export default function RendererDemoPage() {
  return (
    <Layout
      title="Renderer Demo"
      description="Interactive demo of the MIE Forms Renderer">
      <RendererDemo />
    </Layout>
  );
}
