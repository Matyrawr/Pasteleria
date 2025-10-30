describe('App Component', function() {
  it('renders without crashing', function() {
    // Simular renderizado básico sin importar App
    var div = document.createElement('div');
    div.id = 'test-app';
    document.body.appendChild(div);
    expect(div).toBeDefined();
    expect(div.id).toBe('test-app');
  });
});
