import React from 'react';
import Layout from '@theme/Layout';

export default function RendererDemo() {
  return (
    <Layout
      title="Renderer Demo"
      description="Interactive demo of the MIE Forms Renderer">
      <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
        <iframe
          title="Renderer Demo"
          src={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/#/renderer' : '/demos/#/renderer'}
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    </Layout>
  );
}
