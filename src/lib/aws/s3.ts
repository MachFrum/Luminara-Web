import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME || 'luminara-uploads';

export const getPresignedUrl = async (fileName: string, fileType: string): Promise<string> => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `problem-images/${Date.now()}-${fileName}`,
    Expires: 60 * 5, // 5 minutes
    ContentType: fileType,
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return url;
  } catch (error) {
    throw new Error('Failed to generate presigned URL');
  }
};

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const presignedUrl = await getPresignedUrl(file.name, file.type);
    
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    // Return the public URL (without query parameters)
    return presignedUrl.split('?')[0];
  } catch (error) {
    throw new Error('File upload failed');
  }
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const key = fileUrl.split('/').pop();
    if (!key) throw new Error('Invalid file URL');

    const params = {
      Bucket: BUCKET_NAME,
      Key: `problem-images/${key}`,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    throw new Error('Failed to delete file');
  }
};