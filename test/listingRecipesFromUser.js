


exports.listingRecipesFromUser = (request, User, done) => {

    it('It should require authorization', (done) => {
      request
        .get('/profile')
        .then((response) => {
          expect(response.statusCode).toBe(403);
          done();
        });
      
    });
   



    // send the token - should respond with a 200
    // it('It responds with JSON', () => {
    //   return request(app)
    //     .get('/')
    //     .set('Authorization', `Bearer ${token}`)
    //     .then((response) => {
    //       expect(response.statusCode).toBe(200);
    //       expect(response.type).toBe('application/json');
    //     });
    // });


 


}
















