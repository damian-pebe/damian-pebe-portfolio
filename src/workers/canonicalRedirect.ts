const canonicalRedirect = {
  fetch(request: Request): Response {
    const destination = new URL(request.url);
    destination.protocol = "https:";
    destination.hostname = "damianperez.dev";
    destination.port = "";
    return Response.redirect(destination.toString(), 308);
  },
};

export default canonicalRedirect;
