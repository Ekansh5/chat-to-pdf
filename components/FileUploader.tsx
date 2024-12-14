'use client'
import { useCallback, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import { CheckCheckIcon, CheckCircleIcon, CircleArrowDown, HammerIcon, RocketIcon, SaveIcon } from 'lucide-react'
import useUpload, { StatusText } from '@/hooks/useUpload';
import { useRouter } from 'next/navigation';
import useSubscription from '@/hooks/useSubscription';
import { useToast } from '../hooks/use-toast';

function FileUploader() {
    const { progress, status, fileId, handleUpload } = useUpload();
    const { isOverFileLimit, filesLoading } = useSubscription();
    const { toast } = useToast();

    const router = useRouter();
    useEffect(() => {
      if (fileId) {
        router.push(`/dashboard/files/${fileId}`)
      }
    }, [fileId, router])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Do something with the files

        const file = acceptedFiles[0];

        if(file) {
          if (!isOverFileLimit && !filesLoading) {
            await handleUpload(file)
          } else {
            toast({
              variant: "destructive",
              title:"Free Plan Limit Reached",
              description: "You have reached the maximum number of files allowed for your account. Please upgrade to add more documents",
            });
          }
        } else {
          // toast
        }
      }, [handleUpload, isOverFileLimit, filesLoading, toast]);

      const statusIcons: {
        [key in StatusText]: JSX.Element;
      } = {
        [StatusText.UPLOADING]: (
          <RocketIcon className='h-20 w-20 text-acc' />
        ),
        [StatusText.UPLOADED]: (
          <CheckCircleIcon className='h-20 w-20 text-acc' />
        ),
        [StatusText.SAVING]: (
          <SaveIcon className='h-20 w-20 text-acc' />
        ),
        [StatusText.GENERATING]: (
          <HammerIcon className='h-20 w-20 text-acc' />
        ),
      };  

      const {getRootProps, getInputProps, isDragAccept, isDragActive, isFocused} = 
      useDropzone({
          onDrop,
          maxFiles: 1,
          accept: {
            "application/pdf": [".pdf"],
          }
        })

  const uploadInProgress = progress !=null && progress >= 0 && progress <=100
  return (
    <div className='flex flex-col gap-4 items-center max-w-7xl mx-auto'>

    {uploadInProgress && (
      <div className='mt-32 flex flex-col justify-center items-center gap-5'>
        <div className={`radial-progress bg-black/60 text-acc border-acc border-4 ${
          progress === 100 && 'hidden'
        }`}
        role='progressbar'
        style={{
          // @ts-ignore
          "--value": progress,
          "--size": "12rem",
          "--thickness": "1.3rem",
        }}
        >
          {progress} %
        </div> 

        {/* Render Status Icon */}
        {
          // @ts-ignore
          statusIcons[status!]
        }

        {/* @ts-ignore */}
        <p className='text-acc animate-pulse'>{status}</p>
      </div>
    )}

    {!uploadInProgress && (
      <div {...getRootProps()}
      className={`p-10  mt-10 h-96 w-[90%] text-acc rounded-xl flex items-center justify-center ${isFocused || isDragAccept ? "bg-black/40": "bg-black/30"}`}
  >
    <input {...getInputProps()} />
    <div className='flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 bg-bg h-full w-full rounded-xl hover:shadow-md hover:shadow-blue-600'>
    {
      isDragActive ? (
          <>
          <RocketIcon className='h-20 w-20 animate-ping' />
          <p>Drop the files here ...</p>
          </>
        ) : (
          <>
          <CircleArrowDown className='h-20 w-20 mb-3' />
        <p>Drag {"'"}n{"'"} drop, or click to select files</p>
        </>
    )}
  </div>

  </div>
    )}
    </div>
  )
}
export default FileUploader