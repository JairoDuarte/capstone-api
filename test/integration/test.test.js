
describe('Test the root path', () => {
    test('It should response the GET method', () => {

        return request.get("/").then(response => {
            expect(response.statusCode).toBe(200)
        })
    });
})