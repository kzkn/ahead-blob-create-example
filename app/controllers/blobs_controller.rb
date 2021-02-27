class BlobsController < ApplicationController
  def create
    file = params[:file]
    blob = ActiveStorage::Blob.create_and_upload!(io: file, filename: file.original_filename)
    render json: { signed_id: blob.signed_id, url: url_for(blob) }
  end
end
