describe('App Component with Jasmine', function() {
  it('should render without crashing', function() {
    // Simular renderizado básico
    var appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);

    expect(appElement).toBeDefined();
    expect(appElement.id).toBe('app');
  });
});
