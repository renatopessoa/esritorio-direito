import { supabase } from './config';

export async function uploadClientDocument(clientId: string, file: File) {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `clients/${clientId}/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Create document record in the database
    const { error: dbError } = await supabase
      .from('client_documents')
      .insert({
        client_id: clientId,
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
      });

    if (dbError) {
      console.error('Error saving document record:', dbError);
      throw dbError;
    }

    return {
      url: publicUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error in uploadClientDocument:', error);
    throw error;
  }
}