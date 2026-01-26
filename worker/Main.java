import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        
        // Read space-separated integers
        while(scanner.hasNextInt()) {
            sum += scanner.nextInt();
        }
        
        System.out.println(sum);
        scanner.close();
    }
}