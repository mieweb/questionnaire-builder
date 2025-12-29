import React from 'react';
import Layout from '@theme/Layout';
import EditorDemo from '../components/EditorDemo';

export default function EditorDemoPage() {
  return (
    <Layout
      title="Editor Demo"
      description="Interactive demo of the MIE Forms Editor">
      <EditorDemo />
    </Layout>
  );
}
