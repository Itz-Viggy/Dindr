-- Create restaurants table
CREATE TABLE restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    cuisine TEXT NOT NULL,
    price_range TEXT NOT NULL,
    rating DOUBLE PRECISION NOT NULL CHECK (rating >= 0 AND rating <= 5),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for location-based queries
CREATE INDEX restaurants_location_idx ON restaurants USING gist (
    ll_to_earth(latitude, longitude)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO restaurants (name, description, address, latitude, longitude, cuisine, price_range, rating, image_url)
VALUES
    ('The Italian Bistro', 'Authentic Italian cuisine in a cozy setting', '123 Main St, City', 40.7128, -74.0060, 'Italian', '$$$', 4.5, 'https://example.com/italian.jpg'),
    ('Sushi Master', 'Fresh and creative Japanese dishes', '456 Oak Ave, City', 40.7129, -74.0061, 'Japanese', '$$$$', 4.8, 'https://example.com/sushi.jpg'),
    ('Burger Joint', 'Classic American burgers and fries', '789 Pine Rd, City', 40.7130, -74.0062, 'American', '$$', 4.2, 'https://example.com/burger.jpg'); 