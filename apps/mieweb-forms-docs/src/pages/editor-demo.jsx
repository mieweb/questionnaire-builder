import React from 'react';
import Layout from '@theme/Layout';

export default function EditorDemo() {
  return (
    <Layout
      title="Editor Demo"
      description="Interactive demo of the MIE Forms Editor">
      <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
        <iframe
          title="Editor Demo"
          src={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/#/editor' : '/demos/#/editor'}
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    </Layout>
  );
}
