import React from 'react';
import EditEmployee from '../../../components/employees/edit-employee';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <EditEmployee employeeId={id} />
    </div>
  );
};

export default Page;
